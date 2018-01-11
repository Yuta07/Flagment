class Project < ApplicationRecord
  belongs_to :user
  has_many :cards, dependent: :destroy
  has_many :categories, through: :project_categories
  has_many :project_categories, dependent: :destroy
  #新規作成順にする
  default_scope -> { order(created_at: :desc) }
  mount_uploader :picture, PictureUploader

  validates :user_id,presence: true
  validates :name, presence: true, length: { maximum: 40 }
  validate  :picture_size

  def picture_size
    if picture.size > 4.megabytes
      errors.add(:picture, "should be less than 4MB")
    end
  end

end
