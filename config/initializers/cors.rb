Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins ENV["FRONTEND_URL"] || "http://localhost:3000"
    resource "*",
      headers: :any,
      methods: [ :get, :post, :put, :patch, :delete, :options ],
      credentials: true,
      expose: [ "access-token", "expiry", "token-type", "uid", "client" ]
  end
end
