class HomeController < ApplicationController
  before_action  :set_available_tags_to_gon, only: [:index]

  def index
    @user = User.new
    current_user if logged_in?
  end

  def about
  end

end
