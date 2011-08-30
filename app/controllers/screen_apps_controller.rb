class ScreenAppsController < ApplicationController
  def new
    @screen_app = ScreenApp.new
  end
  
  def index
    @screen_apps = ScreenApp.all
  end

  def create
    @screen_app = ScreenApp.new(params[:screen_app])
    
    if @screen_app.save
      render 'index'
    else
      render 'index'
    end
  end
end
