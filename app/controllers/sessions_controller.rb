class SessionsController < ApplicationController

  def new
  end

  def create
    user=User.find_by(email: params[:session][:email])
    if user && user.authenticate(params[:session][:password])
      if user.activate
      log_in user
      params[:session][:remember_me] == '1' ? remember(user) : forget(user)
      flash[:success] = "ログインしました"
      redirect_back_or root_url
      else
        message = "アカウントがアクティベートされていません"
        message += "Eメールをチェックしてください."
        flash[:error] = message
        redirect_to root_url
      end
    else
      @user = User.new
      flash.now[:danger] = "ログインに失敗しました"
      render 'home/index'
    end
  end

  def destroy
    log_out if logged_in?
    flash[:success] = "ログアウトしました"
    redirect_to root_url
  end

end
