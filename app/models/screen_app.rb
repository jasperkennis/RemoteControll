# == Schema Information
#
# Table name: screen_apps
#
#  id          :integer         primary key
#  name        :string(255)
#  url         :string(255)
#  logs_arrows :boolean
#  created_at  :timestamp
#  updated_at  :timestamp
#

class ScreenApp < ActiveRecord::Base
  validates :name,  :presence => true,
                    :length   => { :minimum => 3,
                                   :maximum => 40 },
                    :uniqueness => true
  validates :url,   :presence => true,
                    :uniqueness => true
                    
  validates_format_of :url, :with => URI::regexp(%w(http https))
end
