class ScreenAppsController < ApplicationController
  def new
    @screen_app = ScreenApp.new
  end
  
  def index
    @screen_apps = ScreenApp.all
  end
  
  def edit
    @screen_app = ScreenApp.find(params[:id])
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
    @screen_app = ScreenApp.find(params[:id])
   
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
    @screen_app = ScreenApp.find(params[:id])
  end
end
