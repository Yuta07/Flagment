Rails.application.routes.draw do
  root 'home#index'
  get '/about' => 'home#about'

  get 'users/signup' => 'users#new'
  get 'users/edit'
  get 'users/show'
  get 'users/index'

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
