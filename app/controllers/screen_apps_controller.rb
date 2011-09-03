class ScreenAppsController < ApplicationController

  before_filter :find_screen_app, :only => [:edit, :update, :show, :destroy]
  before_filter :authenticate_user!, :only => [:new, :create, :update, :destroy]
  before_filter :authorized_user, :only => [:destroy, :update] 
  
  def new
    @screen_app = ScreenApp.new
  end
  
  def index
    @screen_apps = ScreenApp.all
  end
  
  def edit
  end

  def create
    @screen_app = ScreenApp.new(params[:screen_app])
    
    respond_to do |format|
      if @screen_app.save
        format.html { redirect_to(@screen_app,
                      :notice => 'The interface was uploaded succesfully.') }
        format.xml  { render :xml => @interface,
                      :status => :created, :location => @interface }
      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @interface.errors,
                      :status => :unprocessable_entity }
      end
    end
  end
  
  def update
    respond_to do |format|
      if @screen_app.update_attributes(params[:screen_app])
        format.html { redirect_to(@screen_app,
                      :notice => 'Post was successfully updated.') }
        format.xml  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @screen_app.errors,
                      :status => :unprocessable_entity }
      end
    end
  end
  
  def show
  end
  
  def destroy
    @screen_app.destroy
    redirect_back_or root_path
  end
  
  private
  
    def find_screen_app
      @screen_app = ScreenApp.find(params[:id])
    end

    def authorized_user
      @screen_app = current_user.screen_apps.find_by_id(params[:id])
      redirect_to root_path if @micropost.nil?
    end
end
