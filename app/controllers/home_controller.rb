class HomeController < ApplicationController
  def index
    @user = User.new
    current_user if logged_in?
  end

  def about
  end

end
