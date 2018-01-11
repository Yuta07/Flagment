class CardsController < ApplicationController
  before_action :logged_in_user, only: [:create, :destroy]
  before_action :correct_user, only: :destroy

  def new
  end

  def index
  end

  def show
  end

  def edit
  end

  def create
    @card = current_user.cards.build do |t|
      t.project_id = params[:project_id]
      t.subject = params[:card][:subject]
      t.user_id = current_user.id
      t.card_picture = params[:card][:card_picture]
    end
    if @card.save
      flash[:success] = "Card created."
      redirect_to request.referrer || root_url
    else
      flash[:error] = "Card creation failure. Please try to create again."
      redirect_to root_url
    end
  end

  def update
  end

  def destroy
    if @card.destroy!
      flash[:success] = "Card was deleted."
      redirect_to request.referrer || root_url
    else
      flash[:error] = "Card delete failure."
      redirect_to root_url
    end
  end


  #privateメソッド

  def correct_user
    @card = current_user.cards.find_by!(project_id: params[:project_id])
    redirect_to root_url if @card.nil?
  end

end
