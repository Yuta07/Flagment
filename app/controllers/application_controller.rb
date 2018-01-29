class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception

  include SessionsHelper

  #before_action

  #タグauto
  def set_available_tags_to_gon
    gon.available_tags = Category.pluck(:name)
  end

  #ログインしているか
  def logged_in_user
    unless logged_in?
      store_location
      flash[:error] = "Please login"
      redirect_to login_url
    end
  end

end
