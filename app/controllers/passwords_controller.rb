class PasswordsController < ApplicationController
  # Endpoint to reset password while logged in
  def update
    # Ensure user is authenticated
    if @current_user.nil?
      render json: { error: "User not authenticated" }, status: :unauthorized
      return
    end

    # Verify current password
    unless @current_user.authenticate(params[:current_password])
      render json: { error: "Current password is incorrect" }, status: :unprocessable_entity
      return
    end

    # Update password
    if @current_user.update(password: params[:new_password])
      render json: { message: "Password updated successfully" }, status: :ok
    else
      render json: {
        error: "Failed to update password",
        details: @current_user.errors.full_messages
      }, status: :unprocessable_entity
    end
  end

  # Optional: Endpoint to reset password via reset token (for email-based reset)
  def reset
    reset_token = params[:reset_token]
    new_password = params[:new_password]

    # Find user with matching reset token that hasn't expired
    user = User.find_by(
      reset_password_token: reset_token,
      reset_password_sent_at: Time.current..(1.hour.from_now)
    )

    if user
      # Reset password and clear reset token
      if user.update(
        password: new_password,
        reset_password_token: nil,
        reset_password_sent_at: nil
      )
        render json: { message: "Password reset successfully" }, status: :ok
      else
        render json: {
          error: "Failed to reset password",
          details: user.errors.full_messages
        }, status: :unprocessable_entity
      end
    else
      render json: { error: "Invalid or expired reset token" }, status: :unauthorized
    end
  end
end
