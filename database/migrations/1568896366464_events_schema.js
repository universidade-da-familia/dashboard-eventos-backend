"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class EventsSchema extends Schema {
  up() {
    this.create("events", table => {
      table.increments();
      table
        .integer("default_event_id")
        .unsigned()
        .references("id")
        .inTable("default_events")
        .onUpdate("CASCADE")
        .onDelete("SET NULL");
      table.integer("order_id");
      table.datetime("start_date").notNullable();
      table.datetime("end_date");
      table
        .integer("responsible_organization_id")
        .unsigned()
        .references("id")
        .inTable("organizations")
        .onUpdate("CASCADE")
        .onDelete("SET NULL");
      table.string("address_name").notNullable();
      table.string("cep", 8).notNullable();
      table.string("city", 254).notNullable();
      table.string("uf", 2).notNullable();
      table.string("country", 100).notNullable();
      table.string("street", 254).notNullable();
      table.string("street_number", 50).notNullable();
      table.string("neighborhood", 100).notNullable();
      table.string("complement", 100);
      table.string("img_address_url").notNullable();
      table
        .integer("participants_count")
        .unsigned()
        .notNullable()
        .defaultTo(0);
      table.boolean("is_finished").notNullable();
      table
        .boolean("is_public")
        .notNullable()
        .defaultTo(false);
      table
        .boolean("is_online_payment")
        .notNullable()
        .defaultTo(false);
      table.timestamps();
    });
  }

  down() {
    this.drop("events");
  }
}

module.exports = EventsSchema;
