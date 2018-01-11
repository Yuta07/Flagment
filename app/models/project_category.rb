class ProjectCategory < ApplicationRecord
  belongs_to :project
  belongs_to :category
  validates :project_id,presence:true
  validates :category_id,presence:true
end
