class Project < ApplicationRecord
  belongs_to :user
  #新規作成順にする
  default_scope -> { order(created_at: :desc) }

  validates :user_id,presence: true
  validates :name, presence: true, length: { maximum: 30 }
end
