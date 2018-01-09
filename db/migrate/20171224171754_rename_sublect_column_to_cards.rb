class RenameSublectColumnToCards < ActiveRecord::Migration[5.1]
  def change
    rename_column :cards, :sublect, :subject
  end
end
