class SessionsController < ApplicationController

  def new
  end

  def create
    user=User.find_by(email: params[:session][:email])
    if user && user.authenticate(params[:session][:password])
      if user.activate
      log_in user
      params[:session][:remember_me] == '1' ? remember(user) : forget(user)
      redirect_back_or user
      else
        message = "Account not activated."
        message += "Check your email for the activation link."
        flash[:error] = message
        redirect_to root_url
      end
    else
      @user = User.new
      flash.now[:danger]="Your input value is not correct"
      render 'home/index'
    end
  end

  def destroy
    log_out if logged_in?
    flash[:success] = "Logout complete"
    redirect_to root_url
  end

end
