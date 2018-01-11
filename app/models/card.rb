class Card < ApplicationRecord
  belongs_to :project
  belongs_to :user
  #新規作成順にする
  default_scope -> { order(created_at: :desc) }
  mount_uploader :card_picture, CardPictureUploader

  validates :user_id, presence: true
  validates :project_id, presence: true
  validates :content, presence: true,  allow_nil: true
  validate  :card_size

  def card_size
    if card_picture.size > 4.megabytes
      errors.add(:picture, "should be less than 4MB")
    end
  end
end
