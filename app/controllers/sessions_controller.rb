class SessionsController < ApplicationController

  def new

  end

  def create
    user=User.find_by(email: params[:session][:email])
    if user && user.authenticate(params[:session][:password])
      log_in user
      params[:session][:remember_me] == '1' ? remember(user) : forget(user)
      flash[:success]="Login succeeded"
      redirect_to user
    else
      @user = User.new
      flash.now[:error]="Something is not correct"
      render 'home/index'
    end
  end

  def destroy
    log_out if logged_in?
    flash[:success] = "Logout complete"
    redirect_to root_url
  end

end
