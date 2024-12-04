ENV["RAILS_ENV"] ||= "test"
ENV["JWT_SECRET"] = "test_secret_key" unless Rails.env.production?
require_relative "../config/environment"
require "rails/test_help"

module ActiveSupport
  class TestCase
    parallelize(workers: :number_of_processors)
    fixtures :all
  end
end
