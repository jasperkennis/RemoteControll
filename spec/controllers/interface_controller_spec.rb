require 'spec_helper'

describe InterfacesController do

  before(:each) do
    @attr = { :name => "Example User", :json => '{"somestring":[]}' }
  end

  it "should create a new instance given valid attributes" do
    Interface.create!(@attr)
  end

  it "should require a name" do
    no_name_interface = Interface.new(@attr.merge(:name => ""))
    no_name_interface.should_not be_valid
  end
  
  it "should reject names that are too short" do
    too_short_name = "a" * 2
    too_short_name_interface = Interface.new(@attr.merge(:name => too_short_name))
    too_short_name_interface.should_not be_valid
  end
  
  it "should reject names that are too long" do
    too_long_name = "a" * 41
    too_long_name_interface = Interface.new(@attr.merge(:name => too_long_name))
    too_long_name_interface.should_not be_valid
  end
  
  it "should reject duplicate names" do
    Interface.create(@attr)
    interface_with_duplicate_name = Interface.new(@attr)
    interface_with_duplicate_name.should_not be_valid
  end
  
  it "should require a json valid string"
  
  it "should reject a non json string"
  
  
end

module JSON
  def is_json?(string)
    begin
      parse(string).all?
    rescue ParserError
      false
    end
  end
end