class AddRegisterArrowsOptionToScreenApps < ActiveRecord::Migration
  def change
    add_column :screen_apps, :register_arrows, :boolean
  end
end
