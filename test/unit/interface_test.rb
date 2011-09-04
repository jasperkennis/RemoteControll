# == Schema Information
#
# Table name: interfaces
#
#  id            :integer         not null, primary key
#  name          :string(255)
#  json          :text(255)
#  created_at    :datetime
#  updated_at    :datetime
#  screen_app_id :integer
#

require 'test_helper'

class InterfaceTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end

