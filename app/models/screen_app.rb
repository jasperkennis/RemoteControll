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
  after_update :save_interfaces
  
  validates :name,  :presence => true,
                    :length   => { :minimum => 3,
                                   :maximum => 40 },
                    :uniqueness => true
  validates :url,   :presence => true,
                    :uniqueness => true
                    
  validates_format_of :url, :with => URI::regexp(%w(http https))
  
  validates :user_id, :presence => true
  
  validates_associated :interface
  
  belongs_to :user
  
  has_many :interfaces, :dependent => :destroy
  
  def new_interface_attributes=(interface_attributes)
    interface_attributes.each do |attributes|
      interfaces.build(attributes)
    end
  end
  
  def existing_interface_attributes=(interface_attributes)
    interfaces.reject(&:new_record?).each do |interface|
      interfaces = interface_attributes[interface.id.to_s]
      if attributes
        interface.attributes = attributes
      else
        interfaces.delete(interface)
      end
    end
  end
  
  def save_interfaces
    interfaces.each do |interface|
      interface.save(false)
    end
  end
end