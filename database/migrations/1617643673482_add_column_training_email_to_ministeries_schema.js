"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class AddColumnTrainingEmailToMinisteriesSchema extends Schema {
  up() {
    this.table("ministeries", (table) => {
      // alter table
      table.string("training_email");
      table.string("seminary_email");
    });
  }

  down() {
    this.table("ministeries", (table) => {
      // reverse alternations
      table.dropColumn("training_email");
      table.dropColumn("seminary_email");
    });
  }
}

module.exports = AddColumnTrainingEmailToMinisteriesSchema;
