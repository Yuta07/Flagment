class AddCardPictureToCards < ActiveRecord::Migration[5.1]
  def change
    add_column :cards, :card_picture, :string
  end
end
