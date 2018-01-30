module ApplicationHelper
  
  def qiita_markdown(markdown)
    processor = Qiita::Markdown::Processor.new(hostname: "example.com")
    processor.call(markdown)[:output].to_s.html_safe
  end

  def image_for(user,size)
    if user.user_image
      image_tag("/user_images/#{user.user_image}",size)
    else
      image_tag("user_default.png",size)
    end
  end
end
