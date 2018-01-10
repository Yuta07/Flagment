class User < ApplicationRecord
  #ユーザー削除でプロジェクトも削除する
  has_many :projects, dependent: :destroy
  has_many :cards, through: :projects, dependent: :destroy

  attr_accessor :remember_token, :activation_token, :reset_token
  before_create :create_activation_digest

  validates :name, presence:true, length:{maximum: 50},
            uniqueness:{case_sensitive: true}

  VALID_EMAIL_REGEX = /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/
  validates :email, presence:true, length:{maximum: 255},
            format:{ with: VALID_EMAIL_REGEX }, uniqueness:{case_sensitive: true}

  has_secure_password
  VALID_PASSWORD_REGEX = /\A(?=.*?[a-z])(?=.*?[A-Z])(?=.*?\d)[a-zA-Z\d]{8,20}+\z/
  validates :password, presence:true, allow_nil: true, length:{in: 8..20},
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

  #attribute => reset,remember,activationを引数にとる
  #token => id,remember_token,id(activation_token)を引数にとる
  def authenticated?(attribute,token)
    digest = send("#{attribute}_digest")
    return false if digest.nil?
    BCrypt::Password.new(digest).is_password?(token)
  end

  def forget
    update_attribute(:remember_digest,nil)
  end

  def activate
    update_columns(activated: true, activated_at: Time.zone.now)
  end

  def send_activation_email
    UserMailer.account_activation(self).deliver_now
  end

  def create_reset_digest
    self.reset_token = User.new_token
    update_columns(reset_digest: User.digest(reset_token),reset_sent_at: Time.zone.now)
  end

  def send_password_reset_email
    UserMailer.password_reset(self).deliver_now
  end

  def password_reset_expired?
    reset_sent_at < 1.hours.ago
  end

  #user_imageがある場合
  def set_image(file)
    if !file.nil?
      file_name = file.original_filename
      perms = ['.jpg','.gif','.jpeg','.png']
      if !perms.include?(File.extname(file_name).downcase)
        flash[:error]= 'Upload is only image file.'
      elsif file.size > 2.megabyte
        flash[:error]= 'Fire size is up to 2 megabytes.'
      else
      File.open("public/user_images/#{file_name}", 'wb') { |f| f.write(file.read) }
      self.user_image = file_name
      end
    end
  end

  #ここからprivateメソッド
  private

  def create_activation_digest
    self.activation_token=User.new_token
    self.activation_digest=User.digest(activation_token)
  end

end
