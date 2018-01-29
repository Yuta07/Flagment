class Category < ApplicationRecord
  has_many :projects_categories, dependent: :destroy
  has_many :projects, through: :projects_categories

  validates :name,presence:true,length:{maximum:20}
end
