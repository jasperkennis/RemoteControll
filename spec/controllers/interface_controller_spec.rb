require 'spec_helper'

describe InterfacesController do

  before(:each) do
    @attr = { :name => "Example User", :json => "{}" }
  end

  it "should create a new instance given valid attributes" do
    Interface.create!(@attr)
  end

  it "should require a name" do
    no_name_interface = Interface.new(@attr.merge(:name => ""))
    no_name_interface.should_not be_valid
  end
  
  it "should reject long names"
  
  it "should reject short names"
  
  it "should require a json string"
  
  it "should reject duplicate names"
end