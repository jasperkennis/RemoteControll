# == Schema Information
#
# Table name: screen_apps
#
#  id              :integer         primary key
#  name            :string(255)
#  url             :string(255)
#  logs_arrows     :boolean
#  created_at      :timestamp
#  updated_at      :timestamp
#  user_id         :integer
#  register_arrows :boolean
#  description     :text
#

require 'test_helper'

class ScreenAppTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end


