
# # for registration

# class UsersController < ApplicationController
#   def create
#     # Check if the username already exists
#     if User.exists?(username: user_params[:username])
#       render json: { errors: [ "Username is already taken" ] }, status: :unprocessable_entity
#       return
#     end

#     # Proceed with user creation if username is unique
#     user = User.new(user_params)

#     if user.save
#       render json: { message: "User created successfully!" }, status: :created
#     else
#       render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
#     end
#   end

#   private

#   def user_params
#     params.require(:user).permit(:username, :password)
#   end
# end

class UsersController < ApplicationController
  skip_before_action :authenticate_user, only: [ :create ]

  def create
    # Map username to email if username is provided
    email = user_params[:email] || user_params[:username]

    # Check if the email already exists
    if User.exists?(email: email)
      render json: { errors: [ "Email is already registered" ] }, status: :unprocessable_entity
      return
    end

    # Create user with mapped email
    user = User.new(user_params.except(:username).merge(email: email))

    if user.save
      render json: { message: "User created successfully!" }, status: :created
    else
      render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def user_params
    # Permit both email and username
    params.require(:user).permit(:email, :username, :password)
  end
end