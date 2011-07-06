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
	attr_accessible :name, :json

	validates :name,  :presence => true,
                    :length   => { :minimum => 3,
                                   :maximum => 40 },
                    :uniqueness => true

	validates :json, :presence => true

	validate :json_format

protected

  def json_format
    errors[:base] << "not in json format" unless json.is_json?
  end
end