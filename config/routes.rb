Rails.application.routes.draw do
  resources :password_resets, only: [ :new, :create, :edit, :update ], param: :token
  post "/change_password", to: "passwords#update"
  resources :users, only: [ :create ]
  post "/login", to: "sessions#login"
  post "/logout", to: "sessions#logout"
  get "/auth_check", to: "sessions#auth_check"
  resources :journal_entries, only: [ :index, :create, :destroy ]
  root to: "journal_entries#index"
end
