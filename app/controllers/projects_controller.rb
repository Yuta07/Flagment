class ProjectsController < ApplicationController
  before_action :logged_in_user, only: [:create,:edit,:destroy]
  before_action :correct_user, only: [:edit,:update,:destroy]
  before_action  :set_available_tags_to_gon, only: [:show]

  def new
  end

  def show
    @user = User.new
    if logged_in?
      @project = current_user.projects.find(params[:id])
      @category_list = @project.categories.pluck(:name).join(",")
      @cards = @project.cards.search(params[:search])
    end
  end

  def edit
  end

  def create
    project = current_user.projects.build(project_params)
    category_list = params[:category_list].split(',') if !params[:category_list].nil?
    if category_list.size > 10
      flash[:error] = "プロジェクトの作成に失敗しました。タグは10個までです"
      redirect_to root_url
    else
      if project.save
        project.save_categories(category_list) if !params[:category_list].nil?
        flash[:success] = "プロジェクトを作成しました"
        redirect_to project_url(project)
      else
        flash[:error] = "プロジェクトの作成に失敗しました。タイトルは必須です"
        redirect_to root_url
      end
    end
  end

  def update
    @project = Project.find(params[:id])
    category_list = params[:category_list].split(",") if !params[:category_list].nil?
    if category_list.size > 10
      flash[:error] = "プロジェクトの更新に失敗しました。タグは10個までです"
      redirect_to project_url
    else
      if @project.update_attributes(project_params)
        @project.save_categories(category_list)
        flash[:success] = "プロジェクトを更新しました"
        redirect_to project_url
      else
        flash[:error] = "プロジェクトの更新に失敗しました。タイトルは必須です"
        redirect_to project_url
      end
    end
  end

  def destroy
    if @project.destroy
      flash[:success] = "プロジェクトを削除しました"
      redirect_to root_url
    else
      flash[:error] = "プロジェクトの削除に失敗しました"
      redirect_to project_url
    end
  end


  #privateメソッド
  private

  #name is project title
  def project_params
    params.require(:project).permit(:name, :picture, :description)
  end

  def correct_user
    @project = current_user.projects.find_by!(id: params[:id])
    redirect_to root_url if @project.nil?
  end

end
