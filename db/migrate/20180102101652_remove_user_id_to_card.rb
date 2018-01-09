class RemoveUserIdToCard < ActiveRecord::Migration[5.1]
  def change
    remove_column :cards, :user_id, :string
  end
end
