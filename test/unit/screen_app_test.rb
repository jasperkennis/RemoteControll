# == Schema Information
#
# Table name: screen_apps
#
#  id              :integer         not null, primary key
#  name            :string(255)
#  url             :string(255)
#  logs_arrows     :boolean
#  created_at      :datetime
#  updated_at      :datetime
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


