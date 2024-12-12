require "openai"
require "net/http"
require "json"
require "uri"

class JournalEntriesController < ApplicationController
  before_action :authenticate_user

  def create
    if @current_user.nil?
      render json: { error: "User not authenticated" }, status: :unauthorized
      return
    end
  
    begin
      # Get the user's rough input
      original_content = journal_entry_params[:content]
      Rails.logger.info "Starting journal entry creation with content length: #{original_content&.length}"
  
      # Enhance the content using OpenAI API
      begin
        enhanced_content = enhance_journal_entry(original_content)
        Rails.logger.info "Successfully enhanced content"
      rescue => e
        Rails.logger.error "Error enhancing content: #{e.message}"
        Rails.logger.error e.backtrace.join("\n")
        raise "Content enhancement failed: #{e.message}"
      end
  
      # Analyze emotions
      begin
        emotion_analysis = analyze_emotions(enhanced_content)
        Rails.logger.info "Emotion analysis completed: #{emotion_analysis.inspect}"
      rescue => e
        Rails.logger.error "Error analyzing emotions: #{e.message}"
        Rails.logger.error e.backtrace.join("\n")
        raise "Emotion analysis failed: #{e.message}"
      end
  
      # Create and save journal entry
      journal_entry = @current_user.journal_entries.new(
        title: journal_entry_params[:title],
        content: enhanced_content,
        primary_emotion: emotion_analysis["primary_emotion"],
        emotion_intensity: emotion_analysis["emotion_intensity"],
        emotion_data: emotion_analysis
      )
  
      Rails.logger.info "Attempting to save journal entry with attributes: #{journal_entry.attributes.except('content').inspect}"
  
      if journal_entry.save
        Rails.logger.info "Successfully saved journal entry with ID: #{journal_entry.id}"
        render json: journal_entry, status: :created
      else
        error_msg = "Failed to save journal entry: #{journal_entry.errors.full_messages.join(', ')}"
        Rails.logger.error error_msg
        render json: { error: error_msg }, status: :unprocessable_entity
      end
  
    rescue StandardError => e
      error_msg = "Journal entry creation failed: #{e.message}"
      Rails.logger.error error_msg
      Rails.logger.error e.backtrace.join("\n")
      render json: { error: error_msg }, status: :unprocessable_entity
    end
  end
  

  def index
    if @current_user.nil?
      render json: { error: "User not authenticated" }, status: :unauthorized
      return
    end

    # Fetch all journal entries for the current user, ordered by creation time
    journal_entries = @current_user.journal_entries.order(created_at: :desc)
    render json: journal_entries
  end

  def destroy
    journal_entry = @current_user.journal_entries.find_by(id: params[:id])

    if journal_entry
      journal_entry.destroy
      render json: { message: "Journal entry deleted successfully!" }, status: :ok
    else
      render json: { error: "Journal entry not found" }, status: :not_found
    end
  end


  def weekly_emotions
    start_date = params[:start_date].to_date
    end_date = params[:end_date].to_date
  
    # Add this logging
    Rails.logger.info "Date Range: #{start_date} to #{end_date}"
    
    entries = @current_user.journal_entries
      .where(created_at: start_date.beginning_of_day..end_date.end_of_day)
    
    # Add this logging
    Rails.logger.info "Found Entries: #{entries.count}"
    Rails.logger.info "Entry Emotions: #{entries.pluck(:primary_emotion)}"
    
    emotion_counts = entries.group(:primary_emotion).count
    
    # Add this logging
    Rails.logger.info "Emotion Counts: #{emotion_counts}"
  
    render json: {
      emotion_counts: emotion_counts,
      total_entries: entries.count,
      date_range: {
        start_date: start_date,
        end_date: end_date
      }
    }
  end


  # add this for deeper analysis

  def monthly_emotions
    start_date = Date.today.beginning_of_month
    end_date = Date.today.end_of_month
    
    entries = @current_user.journal_entries
      .where(created_at: start_date.beginning_of_day..end_date.end_of_day)
    
    emotion_counts = entries.group(:primary_emotion).count
    
    render json: {
      emotion_counts: emotion_counts,
      total_entries: entries.count,
      date_range: {
        start_date: start_date,
        end_date: end_date
      }
    }
  end

  def emotion_trends
    start_date = params[:start_date]&.to_date || 30.days.ago.to_date
    end_date = params[:end_date]&.to_date || Date.today
    
    entries = @current_user.journal_entries
      .where(created_at: start_date.beginning_of_day..end_date.end_of_day)
    
    emotion_counts = entries.group(:primary_emotion).count
    
    render json: {
      emotion_counts: emotion_counts,
      total_entries: entries.count,
      date_range: {
        start_date: start_date,
        end_date: end_date
      }
    }
  end

  def emotion_summary
    entries = @current_user.journal_entries
      .where('created_at > ?', 30.days.ago)
    
    emotion_counts = entries.group(:primary_emotion).count
    intensity_avg = entries.average(:emotion_intensity).to_f.round(1)
    
    render json: {
      emotion_counts: emotion_counts,
      total_entries: entries.count,
      average_intensity: intensity_avg,
      most_common_emotion: emotion_counts.max_by { |_, v| v }&.first
    }
  end

  private

  def journal_entry_params
    params.require(:journal_entry).permit(:title, :content)
  end

  # Enhances the journal entry content using OpenAI's API
  def enhance_journal_entry(content)
    api_key = Rails.application.credentials.dig(:openai, :api_key)

    # Ensure the API key is available
    if api_key.nil? || api_key.empty?
      raise "OpenAI API key is missing!"
    end

    # Prepare the URI for the OpenAI chat completions endpoint
    uri = URI("https://api.openai.com/v1/chat/completions")

    # Set up the request body and headers
    body = {
      model: "gpt-3.5-turbo",  # Use the chat model may need to change to chatgpt 4
      messages: [
        { role: "system", content: "You are a helpful journal entry assistant. When enhancing entries, do not account for the date." },
        { role: "user", content: "Enhance this journal entry:\n\n#{content}" }
      ],
      max_tokens: 150,
      temperature: 0.7
    }.to_json

    headers = {
      "Content-Type" => "application/json",
      "Authorization" => "Bearer #{api_key}"
    }

    # Send the HTTP POST request
    response = Net::HTTP.post(uri, body, headers)

    # Parse the response and return the enhanced content
    begin
      response_body = JSON.parse(response.body)
      enhanced_content = response_body["choices"][0]["message"]["content"].strip
      enhanced_content
    rescue StandardError => e
      logger.error "OpenAI API request failed: #{e.message}"
      "There was an error enhancing the content. Please try again later."
    end
  end

  # In journal_entries_controller.rb
  
  
  def analyze_emotions(content)
    begin
      api_key = Rails.application.credentials.dig(:openai, :api_key)
      Rails.logger.info "Starting emotion analysis"
  
      if api_key.nil? || api_key.empty?
        raise "OpenAI API key is missing"
      end
  
      uri = URI("https://api.openai.com/v1/chat/completions")
  
      system_prompt = <<~PROMPT
        You are an emotional analysis expert. Analyze the emotional content and respond with ONLY valid JSON matching this format:
        {
          "primary_emotion": "EMOTION",
          "emotion_intensity": NUMBER,
          "analysis": "TEXT"
        }
        
        Rules:
        - EMOTION must be one of: joy, contentment, sadness, anxiety, anger, surprise, love, neutral, fear, excitement, gratitude, hope, frustration, disappointment, pride
        - NUMBER must be an integer from 1 to 10 (1 = very mild, 10 = very intense)
        - TEXT should be a brief analysis (max 100 characters)
      PROMPT

      body = {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: system_prompt
          },
          {
            role: "user",
            content: "Analyze this journal entry and respond with ONLY the JSON: #{content}"
          }
        ],
        temperature: 0.3
      }
  
      Rails.logger.info "Sending request to OpenAI API with model: #{body[:model]}"
      
      response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: true) do |http|
        request = Net::HTTP::Post.new(uri)
        request["Content-Type"] = "application/json"
        request["Authorization"] = "Bearer #{api_key}"
        request.body = body.to_json
        http.request(request)
      end
  
      Rails.logger.info "OpenAI API response status: #{response.code}"
      Rails.logger.info "OpenAI API response body: #{response.body}"
  
      response_data = JSON.parse(response.body)
  
      if response.code != "200"
        Rails.logger.error "API Error: #{response_data['error']&.inspect}"
        raise "OpenAI API request failed: #{response_data['error']['message']}"
      end
  
      if response_data["choices"].nil? || response_data["choices"].empty?
        raise "No choices in OpenAI response"
      end
  
      result = JSON.parse(response_data["choices"][0]["message"]["content"])
      
      # Convert emotion_intensity to integer if it's a float
      if result["emotion_intensity"].is_a?(Float)
        result["emotion_intensity"] = (result["emotion_intensity"] * 10).round
      end
      
      # Ensure emotion_intensity is within bounds
      result["emotion_intensity"] = [[result["emotion_intensity"].to_i, 1].max, 10].min
  
      # Validate the response format
      
      valid_emotions = [
        "joy", "contentment", "sadness", "anxiety", 
        "anger", "surprise", "love", "neutral",
        "fear", "excitement", "gratitude", "hope", 
        "frustration", "disappointment", "pride"
      ]

      
      unless result.is_a?(Hash) && 
             valid_emotions.include?(result["primary_emotion"]) && 
             result["emotion_intensity"].is_a?(Integer) && 
             result["emotion_intensity"].between?(1, 10)
        raise "Invalid emotion analysis format"
      end
  
      result
    rescue => e
      Rails.logger.error "Emotion analysis error: #{e.message}"
      Rails.logger.error "Full error: #{e.inspect}"
      Rails.logger.error "Backtrace: #{e.backtrace.join("\n")}"
      
      {
        "primary_emotion" => "neutral",
        "emotion_intensity" => 5,
        "analysis" => "Error analyzing emotions"
      }
    end
  end


end
