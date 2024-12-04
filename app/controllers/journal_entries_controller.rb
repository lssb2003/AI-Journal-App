


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

    # Get the user's rough input
    brief_content = journal_entry_params[:content]  # This is the brief input from the user

    # Enhance the content using OpenAI API
    enhanced_content = enhance_journal_entry(brief_content)

    # Create a new journal entry with the enhanced content
    journal_entry = @current_user.journal_entries.new(journal_entry_params.merge(content: enhanced_content))

    if journal_entry.save
      render json: journal_entry, status: :created
    else
      render json: { errors: journal_entry.errors.full_messages }, status: :unprocessable_entity
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
      model: "gpt-3.5-turbo",  # Use the chat model (e.g., gpt-3.5-turbo)
      messages: [
        { role: "system", content: "You are a helpful journal entry assistant." },
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
end
