# authentication logic centralised

class ApplicationController < ActionController::API
  before_action :authenticate_user

  def authenticate_user
    token = request.headers["Authorization"]&.split(" ")&.last
    puts "Received Token: #{token || 'None'}"

    if token.nil?
      Rails.logger.warn("Unauthorized access: Token not provided for #{request.path}")
      @current_user = nil
      return
    end

    begin
      secret = Rails.env.test? ? "test_secret_key_123" : Rails.application.credentials.secret_key_base
      decoded_token = JWT.decode(token, secret, true, { algorithm: "HS256" })
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
