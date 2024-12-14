class SessionsController < ApplicationController
  skip_before_action :authenticate_user, only: [:login, :forgot_password, :auth_check]

  def login
    login_params = params[:session] || params
    email = login_params[:email]&.downcase

    user = User.find_by("lower(email) = ?", email)
    if user&.authenticate(login_params[:password])
      sign_in(user)
      render json: { message: "Logged in successfully" }
    else
      render json: { error: "Invalid email or password" }, status: :unauthorized
    end
  end

  def logout
    sign_out
    render json: { message: "Logged out successfully" }
  end

  def auth_check
    if current_user
      render json: { 
        authenticated: true, 
        user: { 
          email: current_user.email,
          id: current_user.id 
        } 
      }
    else
      render json: { authenticated: false }
    end
  end

  def forgot_password
    user = User.find_by("lower(email) = ?", params[:email]&.downcase)
    if user
      user.generate_password_reset_token
      render json: { message: "Password reset instructions sent" }
    else
      render json: { error: "Email not found" }, status: :not_found
    end
  end
end