class Project < ApplicationRecord
  belongs_to :user
  has_many :cards, dependent: :destroy
  has_many :project_categories, dependent: :destroy
  has_many :categories, through: :project_categories
  #新規作成順にする
  default_scope -> { order(updated_at: :desc) }
  mount_uploader :picture, PictureUploader

  validates :user_id, presence: true
  validates :name, presence: true, length: { maximum: 40 }
  validates :description, length: { maximum: 255 }
  validate  :picture_size

  def picture_size
    if picture.size > 4.megabytes
      errors.add(:picture, "should be less than 4MB")
    end
  end

  def save_categories(tags)
    current_tags = self.categories.pluck(:name) unless self.categories.nil?
    old_tags = current_tags - tags
    new_tags = tags - current_tags

    # Destroy old taggings:
    old_tags.each do |old_name|
      self.categories.delete Category.find_by(name:old_name)
    end

    # Create new taggings:
    new_tags.each do |new_name|
      project_category = Category.find_or_create_by(name:new_name)
      self.categories << project_category
    end
  end

  scope :from_category, -> (category_id)  { where(id: project_ids = ProjectCategory.where(category_id: category_id).select(:project_id))}

end
