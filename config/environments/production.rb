require "active_support/core_ext/integer/time"

Rails.application.configure do
  # Production settings
  config.enable_reloading = false
  config.eager_load = true
  config.consider_all_requests_local = false

  # Force SSL
  config.force_ssl = true

  # Email configuration
  config.action_mailer.perform_caching = false
  config.action_mailer.delivery_method = :smtp
  config.action_mailer.smtp_settings = {
    address: "smtp.gmail.com",
    port: 587,
    user_name: ENV["SMTP_USERNAME"],     # Set this in your production environment
    password: ENV["SMTP_PASSWORD"],      # Set this in your production environment
    authentication: "plain",
    enable_starttls_auto: true
  }
  config.action_mailer.default_url_options = {
    host: "your-production-domain.com",  # Replace with your actual domain
    protocol: "https"
  }

  # Logging
  config.log_level = :info
  config.log_tags = [ :request_id ]
  config.logger = ActiveSupport::Logger.new(STDOUT)

  # CORS for production frontend
  config.middleware.insert_before 0, Rack::Cors do
    allow do
      origins "your-frontend-domain.com"  # Replace with your frontend domain
      resource "*",
        headers: :any,
        methods: [ :get, :post, :put, :patch, :delete, :options, :head ]
    end
  end

  # Active Record settings
  config.active_record.dump_schema_after_migration = false
end
