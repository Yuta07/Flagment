class UsersController < ApplicationController
  before_action :logged_in_user, only: [:index,:edit,:update,:destroy]
  before_action :correct_user, only: [:edit,:update,:destroy]

  def new
    @user=User.new
  end

  def edit
    @user=User.find(params[:id])
  end

  def show
    @user = User.find(params[:id])
    redirect_to root_url and return unless @user.activated?
  end

  def index
  end

  def create
    @user=User.new(user_params)
    #user_image
    file = params[:user][:user_image]
    @user.set_image(file)
    if @user.save
      @user.send_activation_email
      flash[:info] = "Eメールをチェックしてください"
      redirect_to root_url
    else
      flash.now[:error] = "アカウントの作成に失敗しました"
      render 'home/index'
    end
  end

  def update
    @user=User.find(params[:id])
    file = params[:user][:user_image]
    @user.set_image(file)
    if @user.update_attributes(user_params)
      flash[:success]="アカウントを更新しました"
      redirect_to @user
    else
      flash[:error] = "アカウントの更新に失敗しました"
      render 'edit'
    end
  end

  def destroy
    User.find(params[:id]).destroy
    flash[:success] = "ユーザーを削除しました"
    redirect_to root_url
  end


  #before_action

  #正しいユーザーかどうか
  def correct_user
    @user=User.find(params[:id])
    unless current_user?(@user)
      flash[:error] = "ユーザーが正しくありません"
      redirect_to root_url
    end
  end

  #管理者かどうか
  def admin_user
    redirect_to root_url unless current_user.admin?
  end

  #privateメソッド
  private

  def user_params
    params.require(:user).permit(:name, :email, :password, :password_confirmation)
  end

end
