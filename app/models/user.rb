class User < ApplicationRecord

  validates :name, presence:true, length:{maximum: 50},
            uniqueness:{case_sensitive: true}

  VALID_EMAIL_REGEX = /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/
  validates :email, presence:true, length:{maximum: 255},
            format:{ with: VALID_EMAIL_REGEX }, uniqueness:{case_sensitive: true}

  has_secure_password
  VALID_PASSWORD_REGEX = /\A(?=.*?[a-z])(?=.*?[A-Z])(?=.*?\d)[a-zA-Z\d]{8,20}+\z/
  validates :password, presence:true, length:{in: 8..20},
            format:{ with: VALID_PASSWORD_REGEX }

end
