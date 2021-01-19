"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class SchedulesSchema extends Schema {
  up() {
    this.create("schedules", (table) => {
      table.increments();
      table
        .integer("event_id")
        .unsigned()
        .references("id")
        .inTable("events")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      table.datetime("date").notNullable();
      table.string("start_time", 254).notNullable();
      table.string("end_time", 254).notNullable();
      table.timestamps();
    });
  }

  down() {
    this.drop("schedules");
  }
}

module.exports = SchedulesSchema;
