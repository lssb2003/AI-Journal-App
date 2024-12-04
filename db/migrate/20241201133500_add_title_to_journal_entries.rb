class AddTitleToJournalEntries < ActiveRecord::Migration[7.2]
  def change
    add_column :journal_entries, :title, :string
  end
end
