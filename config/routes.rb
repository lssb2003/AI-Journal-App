Rails.application.routes.draw do
  # Password Reset Routes
  resources :password_resets, only: [ :create, :edit, :update ], param: :token
  post "/change_password", to: "passwords#update"

  # Routes for user registration and authentication
  resources :users, only: [ :create ]
  post "/login", to: "sessions#login"
  post "/logout", to: "sessions#logout"

  # Journal Entries Routes
  resources :journal_entries, only: [ :index, :create, :destroy ]

  # Root Route
  root to: "journal_entries#index"
end
