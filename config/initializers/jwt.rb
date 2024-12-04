JWT_SECRET = Rails.env.test? ? "test_secret_key" : Rails.application.credentials.secret_key_base

Rails.application.configure do
  config.jwt_secret = JWT_SECRET
end
