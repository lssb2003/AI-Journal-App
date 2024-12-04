class PasswordResetsController < ApplicationController
  skip_before_action :authenticate_user, except: :update

  def new
    render json: { message: "Enter email" }
  end

  def create
    user = User.find_by(email: params[:email])
    if user
      temp_password = SecureRandom.alphanumeric(12)
      if user.update(password: temp_password)
        PasswordResetMailer.with(
          user: user,
          temp_password: temp_password
        ).reset_email.deliver_later
        render json: { message: "Reset instructions sent" }
      else
        render json: { error: "Failed to reset password" }, status: :unprocessable_entity
      end
    else
      render json: { error: "Email not found" }, status: :not_found
    end
  end

  def edit
    user = User.find_by(password_reset_token: params[:token])
    if user && !user.password_reset_expired?
      render json: { message: "Token valid" }
    else
      render json: { error: "Invalid token" }, status: :not_found
    end
  end

  def update
    if @current_user&.authenticate(params[:current_password])
      if @current_user.update(password: params[:new_password])
        render json: { message: "Password updated" }
      else
        render json: { error: "Update failed" }, status: :unprocessable_entity
      end
    else
      render json: { error: "Invalid password" }, status: :unauthorized
    end
  end
end
