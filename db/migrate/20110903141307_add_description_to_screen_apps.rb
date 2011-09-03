class AddDescriptionToScreenApps < ActiveRecord::Migration
  def change
    add_column :screen_apps, :description, :text
  end
end
