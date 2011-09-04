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

class ScreenApp < ActiveRecord::Base
  validates :name,  :presence => true,
                    :length   => { :minimum => 3,
                                   :maximum => 40 },
                    :uniqueness => true
  validates :url,   :presence => true,
                    :uniqueness => true
                    
  validates_format_of :url, :with => URI::regexp(%w(http https))
  
  validates :user_id, :presence => true
  
  belongs_to :user
  
  has_many :interfaces, :dependent => :destroy
end


