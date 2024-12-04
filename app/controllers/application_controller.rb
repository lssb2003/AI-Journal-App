# authentication logic centralised

class ApplicationController < ActionController::API
  before_action :authenticate_user

  def authenticate_user
    token = request.headers["Authorization"]&.split(" ")&.last
    puts "Received Token: #{token || 'None'}"  # Always log the token or a placeholder

    if token.nil?
      # Log the issue without rendering an error immediately
      Rails.logger.warn("Unauthorized access: Token not provided for #{request.path}")
      @current_user = nil  # Ensure @current_user is nil for unauthorized requests
      return
    end

    begin
      decoded_token = JWT.decode(token, Rails.application.config.jwt_secret, true, { algorithm: "HS256" })
      user_id = decoded_token[0]["user_id"]
      @current_user = User.find_by(id: user_id)

      unless @current_user
        Rails.logger.warn("Unauthorized access: User not found for decoded token")
        render json: { error: "User not found" }, status: :unauthorized
      end
    rescue JWT::DecodeError
      Rails.logger.warn("Unauthorized access: Invalid or expired token")
      render json: { error: "Invalid or expired token" }, status: :unauthorized
    end
  end
end
