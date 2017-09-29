class UsersController < ApplicationController
  def new
    @user=User.new
  end

  def edit
  end

  def show
    @user=User.find_by(params[:id])
  end

  def index
    @user=User.all(params[:id])
  end

  def create
    @user=User.new(user_params)
    if @user.save
      log_in @user
      flash[:success] = "Created new account"
      redirect_to @user
    else
      flash[:error] = "Account creation failure"
      render 'home/index'
    end
  end


  #privateメソッド
  private

    def user_params
      params.require(:user).permit(:name, :email, :password, :password_confirmation)
    end

end
