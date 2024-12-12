class SessionsController < ApplicationController
  skip_before_action :authenticate_user, only: [ :login, :forgot_password, :auth_check ]

  def login
    user = User.find_by("lower(email) = ?", params[:email].downcase)
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
    user = User.find_by("lower(email) = ?", params[:email].downcase)
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
