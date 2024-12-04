class AddEmailAndResetToUsers < ActiveRecord::Migration[7.2]
  def change
    add_column :users, :email, :string
    add_index :users, :email, unique: true
    add_column :users, :password_reset_token, :string
    add_column :users, :password_reset_sent_at, :datetime
  end
end
