require_relative "boot"

require "rails/all"

Dotenv::Railtie.load if defined?(Dotenv::Railtie)
Bundler.require(*Rails.groups)

module JournalApp
  class Application < Rails::Application
    config.load_defaults 7.2

    config.api_only = false

    config.middleware.use ActionDispatch::Cookies
    config.middleware.use ActionDispatch::Session::CookieStore,
      key: "_journal_app_session",
      secure: Rails.env.production?,
      same_site: :lax,
      expire_after: 7.days

    config.middleware.insert_before 0, Rack::Cors do
      allow do
        origins "http://localhost:3000"
        resource "*",
          headers: :any,
          methods: [ :get, :post, :put, :patch, :delete, :options ],
          credentials: true,
          expose: [ "access-token", "expiry", "token-type", "uid", "client" ]
      end
    end

    config.action_mailer.default_options = { from: "lssb2003@gmail.com" }
  end
end
