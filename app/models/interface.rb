class Interface < ActiveRecord::Base
  def self.save(upload)
    name =  upload['datafile'].original_filename
  end
end
