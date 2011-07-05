# == Schema Information
#
# Table name: interfaces
#
#  id         :integer         not null, primary key
#  name       :string(255)
#  json       :string(255)
#  created_at :datetime
#  updated_at :datetime
#

class Interface < ActiveRecord::Base
  attr_accessible :name
end
