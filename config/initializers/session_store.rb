Rails.application.config.session_store :cookie_store,
  key: "_journal_app_session",
  same_site: :lax,
  secure: Rails.env.production?,
  expire_after: 7.days
