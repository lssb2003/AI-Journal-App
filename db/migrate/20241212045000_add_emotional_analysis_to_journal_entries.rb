class AddEmotionalAnalysisToJournalEntries < ActiveRecord::Migration[7.0]
  def change
    add_column :journal_entries, :primary_emotion, :string
    add_column :journal_entries, :emotion_intensity, :integer
    add_column :journal_entries, :emotion_data, :jsonb
  end
end