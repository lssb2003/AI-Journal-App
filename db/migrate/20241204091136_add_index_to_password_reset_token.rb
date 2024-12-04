class AddIndexToPasswordResetToken < ActiveRecord::Migration[7.2]
  def change
    add_index :users, :password_reset_token, unique: true, where: "password_reset_token IS NOT NULL"
  end
end
