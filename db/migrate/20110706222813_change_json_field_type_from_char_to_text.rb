class ChangeJsonFieldTypeFromCharToText < ActiveRecord::Migration
  def up
    change_column :interfaces, :json, :text
  end

  def down
    change_column :interfaces, :json, :string
  end
end
