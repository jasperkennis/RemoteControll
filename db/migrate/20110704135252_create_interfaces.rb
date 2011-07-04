class CreateInterfaces < ActiveRecord::Migration
  def change
    create_table :interfaces do |t|
      t.string :name
      t.string :json

      t.timestamps
    end
  end
end
