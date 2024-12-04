require "test_helper"

class PasswordResetsControllerTest < ActionDispatch::IntegrationTest
  def setup
    @user = users(:one)
    @auth_token = generate_token_for(@user)
  end

  def generate_token_for(user)
    JWT.encode({ user_id: user.id }, Rails.application.config.jwt_secret, "HS256")
  end


  test "should get new" do
    get new_password_reset_path
    assert_response :success
  end

  test "should get create" do
    post password_resets_path, params: { email: @user.email }
    assert_response :success
  end

  test "should get edit" do
    @user.generate_password_reset_token
    token = @user.password_reset_token
    get edit_password_reset_path(token)
    assert_response :success
  end

  test "should get update" do
    headers = { "Authorization" => "Bearer #{@auth_token}" }
    patch password_reset_path(@user.password_reset_token),
      params: { current_password: "password123", new_password: "new123" },
      headers: headers
    assert_response :success
  end
end
