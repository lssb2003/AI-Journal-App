class PasswordResetMailer < ApplicationMailer
  default from: "no-reply@yourapp.com"

  def reset_email
    @user = params[:user]
    @temp_password = params[:temp_password]  # Get the temporary password from params
    mail(to: @user.email, subject: "Your Temporary Password")
  end

  def password_changed
    @user = params[:user]
    mail(to: @user.email, subject: "Your Password Has Been Changed")
  end
end
