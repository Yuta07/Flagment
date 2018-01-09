Rails.application.routes.draw do

  get 'password_resets/new'
  get 'password_resets/edit'

  root 'home#index'
  get '/about' => 'home#about'

  get 'users/signup'=> 'home#index'
  get 'users/:id/edit' => 'users#edit'
  get 'users/:id' => 'users#show'
  get 'users' => 'home#index'
  post 'users/signup' => 'users#create'

  get 'login' => 'home#index'
  post 'login' => 'sessions#create'
  delete 'logout' => 'sessions#destroy'

  resources :users

  resources :projects do
    resources :cards
  end
  
  resources :account_activations, only: [:edit]
  resources :password_resets, only: [:new, :create, :edit, :update]

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
