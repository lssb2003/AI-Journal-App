# require "jwt"
# require "securerandom"

# class SessionsController < ApplicationController
#   skip_before_action :authenticate_user, only: [ :login, :forgot_password ]

#   # POST /login - Authenticate user and generate JWT
#   def login
#     # Change to use email instead of username
#     user = User.find_by(email: params[:email])
#     if user&.authenticate(params[:password])
#       render json: { token: encode_token({ user_id: user.id }) }
#     else
#       render json: { error: "Invalid email or password" }, status: :unauthorized
#     end
#   end

#   # POST /logout - Optionally, handle logout by invalidating the JWT (if applicable)
#   def logout
#     # Since JWT is stateless, logout is typically done client-side (e.g., by deleting the token)
#     render json: { message: "Logged out successfully" }, status: :ok
#   end

#   # POST /forgot_password - Send password reset instructions
#   def forgot_password
#     user = User.find_by(email: params[:email])

#     if user
#       # Generate a secure reset token
#       reset_token = SecureRandom.urlsafe_base64
#       reset_token_expires_at = 1.hour.from_now

#       # Update user with reset token and expiration
#       user.update(
#         reset_password_token: reset_token,
#         reset_password_sent_at: reset_token_expires_at
#       )

#       # Here you would typically send an email with reset instructions
#       # For now, we'll return the token (in a real app, you'd email this)
#       render json: {
#         message: "Password reset instructions sent",
#         reset_token: reset_token
#       }, status: :ok
#     else
#       render json: { error: "No user found with that email" }, status: :not_found
#     end
#   end

#   private

#   def encode_token(payload)
#     JWT.encode(payload, Rails.application.credentials.secret_key_base)
#   end
# end

class SessionsController < ApplicationController
  skip_before_action :authenticate_user, only: [ :login, :forgot_password, :auth_check ]

  def login
    user = User.find_by(email: params[:email])
    if user&.authenticate(params[:password])
      sign_in(user)
      render json: { message: "Logged in successfully" }
    else
      render json: { error: "Invalid email or password" }, status: :unauthorized
    end
  end

  def logout
    sign_out
    render json: { message: "Logged out successfully" }, status: :ok
  end

  def auth_check
    response = { authenticated: !!current_user }
    render json: response, status: :ok
  end


  def forgot_password
    user = User.find_by(email: params[:email])
    if user
      reset_token = SecureRandom.urlsafe_base64
      reset_token_expires_at = 1.hour.from_now
      user.update(
        reset_password_token: reset_token,
        reset_password_sent_at: reset_token_expires_at
      )
      render json: {
        message: "Password reset instructions sent",
        reset_token: reset_token
      }, status: :ok
    else
      render json: { error: "No user found with that email" }, status: :not_found
    end
  end
end
