class HomeController < ApplicationController
  before_action  :set_available_tags_to_gon, only: [:index]

  def index
    @user = User.new
    if logged_in?
      current_user
      @project = current_user.projects.search(params[:search])
      if params[:category_id]
        @project = current_user.projects.from_category(params[:category_id])
      end
      pids = current_user.projects.pluck('id')
      cids = ProjectCategory.where(project_id: pids).pluck('category_id').uniq
      @catetags = Category.where(id: cids)
    end
  end

end
