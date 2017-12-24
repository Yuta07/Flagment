class AddPictureToProjects < ActiveRecord::Migration[5.1]
  def change
    add_column :projects, :picture, :string
  end
end
