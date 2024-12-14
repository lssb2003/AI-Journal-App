Rails.application.routes.draw do
  resources :password_resets, only: [ :new, :create, :edit, :update ], param: :token
  post "/change_password", to: "passwords#update"
  resources :users, only: [ :create ]
  post "/login", to: "sessions#login"
  post "/logout", to: "sessions#logout"
  get "/auth_check", to: "sessions#auth_check"

  resources :journal_entries, only: [ :index, :create, :destroy ] do
    collection do
      get "weekly_emotions"
      # Add these new routes for enhanced emotion analysis
      get "monthly_emotions"  # Get emotion trends over the past month
      get "emotion_trends"    # Get emotion trends over a custom date range
      get "emotion_summary"   # Get a summary of emotional patterns
    end
  end



  root to: "journal_entries#index"
end
