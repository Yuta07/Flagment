class Card < ApplicationRecord
  belongs_to :project
  belongs_to :user
  #新規作成順にする
  default_scope -> { order(created_at: :desc) }

  validates :user_id, presence: true
  validates :project_id, presence: true
  validates :content, presence: true,  allow_nil: true
end
