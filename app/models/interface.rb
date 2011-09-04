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

class Interface < ActiveRecord::Base
	attr_accessible :name, :json

	validates :name,  :presence => true,
                    :length   => { :minimum => 3,
                                   :maximum => 40 },
                    :uniqueness => true

	validates :json, :presence => true
	
	validates :screen_app_id, :presence => true

	belongs_to :screen_app

protected

  def json_format
    errors[:base] << "not in json format" unless json.is_json?
  end
end

