require "active_support/core_ext/integer/time"

Rails.application.configure do
  # Development settings
  config.enable_reloading = true
  config.eager_load = false
  config.consider_all_requests_local = true
  config.server_timing = true

  # Disable caching
  config.cache_store = :null_store
  config.action_controller.perform_caching = false

  # Email configuration for password reset
  config.action_mailer.raise_delivery_errors = true
  config.action_mailer.perform_caching = false
  config.action_mailer.delivery_method = :smtp
  config.action_mailer.smtp_settings = {
    address: "smtp.gmail.com",
    port: 587,
    domain: "gmail.com",
    user_name: ENV["SMTP_USERNAME"],
    password: ENV["SMTP_PASSWORD"],
    authentication: "plain",
    enable_starttls_auto: true
  }

  config.action_mailer.default_url_options = { host: "localhost", port: 3001 }

  # Debug settings
  config.active_record.migration_error = :page_load
  config.active_record.verbose_query_logs = true

  # CORS for React frontend
  config.middleware.insert_before 0, Rack::Cors do
    allow do
      origins "http://localhost:3000"
      resource "*",
        headers: :any,
        methods: [ :get, :post, :put, :patch, :delete, :options, :head ]
    end
  end

  # ActionCable settings for WebSocket
  config.action_cable.disable_request_forgery_protection = true
  
  # Update CORS settings to include WebSocket
  config.middleware.insert_before 0, Rack::Cors do
    allow do
      origins "http://localhost:3000"
      resource "*",
        headers: :any,
        methods: [:get, :post, :put, :patch, :delete, :options, :head],
        credentials: true
    end
  end

  # Allow ActionCable requests from your React app
  config.action_cable.allowed_request_origins = [
    'http://localhost:3000'
  ]
end