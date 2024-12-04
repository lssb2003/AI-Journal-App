class PasswordResetsController < ApplicationController
  skip_before_action :authenticate_user, only: [ :create ]

  def create
    user = User.find_by(email: params[:email])
    if user
      # Generate a temporary password (12 characters with letters and numbers)
      temp_password = SecureRandom.alphanumeric(12)

      if user.update(password: temp_password)
        # Send email with the temporary password
        PasswordResetMailer.with(
          user: user,
          temp_password: temp_password
        ).reset_email.deliver_later

        render json: {
          message: "A temporary password has been sent to your email"
        }, status: :ok
      else
        render json: {
          error: "Failed to reset password"
        }, status: :unprocessable_entity
      end
    else
      render json: {
        error: "Email address not found"
      }, status: :not_found
    end
  end

  def update
    # Keep this for when users want to change their password while logged in
    if @current_user.nil?
      render json: { error: "User not authenticated" }, status: :unauthorized
      return
    end

    unless @current_user.authenticate(params[:current_password])
      render json: { error: "Current password is incorrect" }, status: :unprocessable_entity
      return
    end

    if @current_user.update(password: params[:new_password])
      PasswordResetMailer.with(user: @current_user).password_changed.deliver_later
      render json: { message: "Password updated successfully" }, status: :ok
    else
      render json: {
        error: "Failed to update password",
        details: @current_user.errors.full_messages
      }, status: :unprocessable_entity
    end
  end
end
