require 'spec_helper'

describe InterfacesController do

  before(:each) do
    @attr = { :name => "Example User", :json => '{"widget": {
    "debug": "on",
    "window": {
        "title": "Sample Konfabulator Widget",
        "name": "main_window",
        "width": 500,
        "height": 500
    },
    "image": { 
        "src": "Images/Sun.png",
        "name": "sun1",
        "hOffset": 250,
        "vOffset": 250,
        "alignment": "center"
    },
    "text": {
        "data": "Click Here",
        "size": 36,
        "style": "bold",
        "name": "text1",
        "hOffset": 250,
        "vOffset": 100,
        "alignment": "center",
        "onMouseUp": "sun1.opacity = (sun1.opacity / 100) * 90;"
    }
}}' }
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
    Interface.create!(@attr)
    interface_with_duplicate_name = Interface.new(@attr)
    interface_with_duplicate_name.should_not be_valid
  end
  
  it "should reject an interface without a json string" do
    empty_json_string = ""
    empty_json_string_interface = Interface.new(@attr.merge(:json => empty_json_string))
    empty_json_string_interface.should_not be_valid
  end
  
  it "should reject an interface with an invalid json string" do
    invalid_json_string = "2" * 10
    invalid_json_string_interface = Interface.new(@attr.merge(:json => invalid_json_string))
    invalid_json_string_interface.should_not be_valid
  end
end