module ApplicationHelper
  def image_for(user,size)
    if user.user_image
      image_tag("/user_images/#{user.user_image}",size)
    else
      image_tag("user_default.png",size)
    end
  end
end
