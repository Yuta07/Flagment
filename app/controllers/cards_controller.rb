class CardsController < ApplicationController
  before_action :logged_in_user, only: [:create, :destroy]
  before_action :correct_user, only: [:edit,:update,:destroy]

  def new
  end

  def index
  end

  def show
    @card = current_user.cards.find(params[:id])
    @project = @card.project
  end

  def edit
    @card = current_user.cards.find(params[:id])
    @project = @card.project
  end

  def create
    @card = current_user.cards.build do |t|
      t.project_id = params[:project_id]
      t.subject = params[:card][:subject]
      t.user_id = current_user.id
      t.card_picture = params[:card][:card_picture]
    end
    if @card.save
      flash[:success] = "カードを作成しました"
      redirect_to request.referrer || root_url
    else
      @project = @card.project
      flash[:error] = "カードの作成に失敗しました。もう一度行ってください"
      redirect_to project_url(@project)
    end
  end

  def update
    @card = current_user.cards.find(params[:id])
    if @card.update_attributes(card_params)
      flash[:success] = "カードを更新しました"
      redirect_to card_url(@card)
    else
      flash[:error] = "カードの更新に失敗しました"
      redirect_to edit_card_url(@card)
    end
  end

  def destroy
    @project = @card.project
    if @card.destroy!
      flash[:success] = "カードを削除しました"
      redirect_to project_url(@project)
    else
      flash[:error] = "カードの削除に失敗しました"
      redirect_to edit_card_url(@card)
    end
  end


  #privateメソッド

  def card_params
    params.require(:card).permit(:subject, :card_picture, :content)
  end

  def correct_user
    @card = current_user.cards.find_by!(id: params[:id])
    redirect_to root_url if @card.nil?
  end

end
