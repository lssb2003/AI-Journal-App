JWT_SECRET = "test_secret_key" if Rails.env.test?

Rails.application.configure do
  config.jwt_secret = JWT_SECRET || Rails.application.credentials.secret_key_base
end
