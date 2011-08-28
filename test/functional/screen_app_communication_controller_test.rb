require 'test_helper'

class ScreenAppCommunicationControllerTest < ActionController::TestCase
  test "should get led" do
    get :led
    assert_response :success
  end

end
