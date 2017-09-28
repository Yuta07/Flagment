class User < ApplicationRecord
  attr_accessor :remember_token

  validates :name, presence:true, length:{maximum: 50},
            uniqueness:{case_sensitive: true}

  VALID_EMAIL_REGEX = /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/
  validates :email, presence:true, length:{maximum: 255},
            format:{ with: VALID_EMAIL_REGEX }, uniqueness:{case_sensitive: true}

  has_secure_password
  VALID_PASSWORD_REGEX = /\A(?=.*?[a-z])(?=.*?[A-Z])(?=.*?\d)[a-zA-Z\d]{8,20}+\z/
  validates :password, presence:true, length:{in: 8..20},uniqueness:true,
            format:{ with: VALID_PASSWORD_REGEX }


  def User.digest(string)
      cost = ActiveModel::SecurePassword.min_cost ? BCrypt::Engine::MIN_COST :
                                                             BCrypt::Engine.cost
      BCrypt::Password.create(string, cost: cost)
  end

  def User.new_token
    SecureRandom.urlsafe_base64
  end

  def remember
    self.remember_token=User.new_token
    update_attribute(:remember_digest,User.digest(remember_token))
  end

  def authenticated?(remember_token)
    return false if remember_digest.nil?
    BCrypt::Password.new(remember_digest).is_password?(remember_token)
  end

  def forget
    update_attribute(:remember_digest,nil)
  end

end
