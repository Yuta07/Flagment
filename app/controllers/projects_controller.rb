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
    end
  end

  def edit
  end

  def create
    project = current_user.projects.build(project_params)
    category_list = params[:category_list].split(',') if !params[:category_list].nil?
    if category_list.size > 10
      flash[:error] = "Project creation failure. Tag is up to 10"
      redirect_to root_url
    else
      if project.save
        project.save_categories(category_list)if !params[:category_list].nil?
        flash[:success] = "Project cration successfully"
        redirect_to project_url(project)
      else
        flash[:error] = "Project creation failure. Title is necessary"
        redirect_to root_url
      end
    end
  end

  def update
    @project = Project.find(params[:id])
    category_list = params[:category_list].split(",") if !params[:category_list].nil?
    if category_list.size > 10
      flash[:error] = "Project update failure. Tag is up to 10"
      redirect_to project_url
    else
      if @project.update_attributes(project_params)
        @project.save_categories(category_list)
        flash[:success] = "Project was updated"
        redirect_to project_url
      else
        flash[:error] = "Project update failure. Title is necessary"
        redirect_to project_url
      end
    end
  end

  def destroy
    if @project.destroy
      flash[:success] = "Project was deleted"
      redirect_to root_url
    else
      flash[:error] = "Project delete failure."
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
