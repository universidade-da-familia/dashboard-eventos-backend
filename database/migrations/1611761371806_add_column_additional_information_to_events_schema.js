"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class AddColumnAdditionalInformationToEventsSchema extends Schema {
  up() {
    this.table("events", (table) => {
      // alter table
      table.text("additional_information");
    });
  }

  down() {
    this.table("events", (table) => {
      // reverse alternations
      table.dropColumn("additional_information");
    });
  }
}

module.exports = AddColumnAdditionalInformationToEventsSchema;
