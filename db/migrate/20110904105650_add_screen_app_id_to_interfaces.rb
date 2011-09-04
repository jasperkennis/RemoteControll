class AddScreenAppIdToInterfaces < ActiveRecord::Migration
  def change
    add_column :interfaces, :screen_app_id, :integer
  end
end
