class UpdatePasswordResetTokenIndex < ActiveRecord::Migration[7.2]
  def change
    remove_index :users, :password_reset_token
    add_index :users, :password_reset_token, unique: false
  end
end
