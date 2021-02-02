'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddContactColumnsIntoEventsSchema extends Schema {
  up () {
    this.table('events', (table) => {
      // alter table
      table.string('contact_name')
      table.string('contact_email')
      table.string('contact_phone')
      table.integer('inscriptions_limit')
    })
  }

  down () {
    this.table('events', (table) => {
      // reverse alternations
      table.dropColumn('contact_name')
      table.dropColumn('contact_email')
      table.dropColumn('contact_phone')
      table.dropColumn('inscriptions_limit')
    })
  }
}

module.exports = AddContactColumnsIntoEventsSchema
