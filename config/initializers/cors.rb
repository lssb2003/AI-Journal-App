Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins "*"  # Change this if your frontend is running on a different URL

    resource "*",
      headers: :any,
      methods: [ :get, :post, :put, :patch, :delete, :options, :head ],
      expose: [ "Authorization" ]
  end
end
