class RemoveExplanationToProject < ActiveRecord::Migration[5.1]
  def change
    remove_column :projects, :explanation, :string
  end
end
