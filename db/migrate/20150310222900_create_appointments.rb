class CreateAppointments < ActiveRecord::Migration
  def change
    create_table :appointments do |t|
      t.text :title
      t.boolean :completed

      t.timestamps null: false
    end
  end
end
