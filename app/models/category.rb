class Category < ApplicationRecord
  has_many :project, through: :articles_categories
  has_many :project_categories, dependent: :destroy

  validates :name,presence:true,length:{maximum:20}
  validates :project_id,presence:true
end
