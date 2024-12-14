class AddIndexToPrimaryEmotion < ActiveRecord::Migration[7.2]
  def change
    add_index :journal_entries, :primary_emotion
  end
end
