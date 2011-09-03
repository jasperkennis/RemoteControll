class AddUserIdToScreenApps < ActiveRecord::Migration
  def change
    add_column :screen_apps, :user_id, :integer
  end
end
