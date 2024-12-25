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

      # Combine enhancement and emotion analysis in a single API call
      begin
        analyzed_content = analyze_and_enhance_content(original_content)
        Rails.logger.info "Successfully processed content and emotions"
      rescue => e
        Rails.logger.error "Error processing content: #{e.message}"
        Rails.logger.error e.backtrace.join("\n")
        raise "Content processing failed: #{e.message}"
      end

      # Create and save journal entry
      journal_entry = @current_user.journal_entries.new(
        title: journal_entry_params[:title],
        content: analyzed_content["enhanced_content"],
        primary_emotion: analyzed_content["emotion_data"]["primary_emotion"],
        emotion_intensity: analyzed_content["emotion_data"]["emotion_intensity"],
        emotion_data: analyzed_content["emotion_data"]
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
    # Parse requested date or default to current month
    requested_date = if params[:date].present?
      begin
        Date.parse(params[:date])
      rescue ArgumentError
        Rails.logger.error "Invalid date format received: #{params[:date]}"
        Date.today
      end
    else
      Date.today
    end

    Rails.logger.info "Processing request for date: #{requested_date}"

    start_date = requested_date.beginning_of_month
    end_date = requested_date.end_of_month

    entries = @current_user.journal_entries
      .where(created_at: start_date.beginning_of_day..end_date.end_of_day)

    emotion_counts = entries.group(:primary_emotion).count
    total_entries = entries.count

    Rails.logger.info "Found #{total_entries} entries for #{start_date} to #{end_date}"
    Rails.logger.info "Emotion counts: #{emotion_counts.inspect}"

    render json: {
      emotion_counts: emotion_counts,
      total_entries: total_entries,
      date_range: {
        start_date: start_date.strftime("%Y-%m-%d"),
        end_date: end_date.strftime("%Y-%m-%d")
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
      .where("created_at > ?", 30.days.ago)

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
  def analyze_and_enhance_content(content)
    api_key = Rails.application.credentials.dig(:openai, :api_key)

    if api_key.nil? || api_key.empty?
      raise "OpenAI API key is missing!"
    end

    uri = URI("https://api.openai.com/v1/chat/completions")

    system_prompt = <<~PROMPT
      You are a journal entry assistant that enhances content and analyzes emotions.#{' '}
      Respond with ONLY valid JSON matching this format:
      {
        "enhanced_content": "ENHANCED_TEXT",
        "emotion_data": {
          "primary_emotion": "EMOTION",
          "emotion_intensity": NUMBER,
          "analysis": "TEXT"
        }
      }

      Rules:
      - ENHANCED_TEXT should be an improved version of the input text
      - EMOTION must be one of: joy, contentment, sadness, anxiety, anger, surprise, love, neutral, fear, excitement, gratitude, hope, frustration, disappointment, pride
      - NUMBER must be an integer from 1 to 10 (1 = very mild, 10 = very intense)
      - TEXT should be a brief analysis (max 100 characters)

      Enhance the text to be more descriptive and detailed while maintaining the original meaning and sentiment.
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
          content: "Process this journal entry: #{content}"
        }
      ],
      temperature: 0.3
    }

    Rails.logger.info "Sending request to OpenAI API"

    response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: true) do |http|
      request = Net::HTTP::Post.new(uri)
      request["Content-Type"] = "application/json"
      request["Authorization"] = "Bearer #{api_key}"
      request.body = body.to_json
      http.request(request)
    end

    Rails.logger.info "OpenAI API response status: #{response.code}"

    if response.code != "200"
      response_data = JSON.parse(response.body)
      Rails.logger.error "API Error: #{response_data['error']&.inspect}"
      raise "OpenAI API request failed: #{response_data['error']['message']}"
    end

    result = JSON.parse(response.body)
    processed_content = JSON.parse(result["choices"][0]["message"]["content"])

    # Validate emotion data
    valid_emotions = [
      "joy", "contentment", "sadness", "anxiety",
      "anger", "surprise", "love", "neutral",
      "fear", "excitement", "gratitude", "hope",
      "frustration", "disappointment", "pride"
    ]

    emotion_data = processed_content["emotion_data"]
    unless valid_emotions.include?(emotion_data["primary_emotion"]) &&
           emotion_data["emotion_intensity"].is_a?(Integer) &&
           emotion_data["emotion_intensity"].between?(1, 10)
      raise "Invalid emotion analysis format"
    end

    processed_content
  rescue => e
    Rails.logger.error "Content processing error: #{e.message}"
    Rails.logger.error e.backtrace.join("\n")

    # Return a safe default response
    {
      "enhanced_content" => content,
      "emotion_data" => {
        "primary_emotion" => "neutral",
        "emotion_intensity" => 5,
        "analysis" => "Error analyzing content"
      }
    }
  end
end
