class CreateScreenApps < ActiveRecord::Migration
  def change
    create_table :screen_apps do |t|
      t.string :name
      t.string :url
      t.boolean :logs_arrows

      t.timestamps
    end
  end
end
