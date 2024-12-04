require_relative "boot"

require "rails/all"

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Dotenv::Railtie.load if defined?(Dotenv::Railtie)
Bundler.require(*Rails.groups)

module JournalApp
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 7.2

    # Configuration for the application, engines, and railties goes here.
    #
    # These settings can be overridden in specific environments using the files
    # in config/environments, which are processed later.
    #
    # config.time_zone = "Central Time (US & Canada)"
    # config.eager_load_paths << Rails.root.join("extras")

    # Only loads a smaller set of middleware suitable for API only apps.
    # Middleware like session, flash, cookies can be added back manually.
    # Skip views, helpers, and assets when generating a new resource.
    config.api_only = true

    # Add Rack::Cors middleware for handling CORS requests from the frontend.
    config.middleware.insert_before 0, Rack::Cors do
      allow do
        origins "http://localhost:3000" # Allow React frontend to make requests
        resource "*", # Allow all resources
                 headers: :any, # Allow any headers
                 methods: [ :get, :post, :put, :patch, :delete, :options ] # Allow these methods
      end
    end

    config.action_mailer.default_options = { from: "lssb2003@gmail.com" }
    config.jwt_secret = ENV.fetch("JWT_SECRET") { "default_jwt_secret" }
  end
end
