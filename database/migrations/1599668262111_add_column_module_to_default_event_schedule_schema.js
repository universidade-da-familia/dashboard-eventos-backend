"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class AddColumnModuleToDefaultEventScheduleSchema extends Schema {
  up() {
    this.table("default_event_schedules", (table) => {
      // alter table
      table.integer("module", 2);
    });
  }

  down() {
    this.table("default_event_schedules", (table) => {
      // reverse alternations
      table.dropColumn("module");
    });
  }
}

module.exports = AddColumnModuleToDefaultEventScheduleSchema;
