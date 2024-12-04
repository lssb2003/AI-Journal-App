ENV["RAILS_ENV"] ||= "test"
require_relative "../config/environment"
require "rails/test_help"

Rails.application.credentials.stub :secret_key_base, "test_secret" do
  module ActiveSupport
    class TestCase
      parallelize(workers: :number_of_processors)
      fixtures :all
    end
  end
end
