class InterfacesController < ApplicationController
  def new
    @interface = Interface.new
    
    respond_to do |format|
      format.html
      format.xml  { render :xml => @interface }
    end
  end
  
  def create
    
  end
end