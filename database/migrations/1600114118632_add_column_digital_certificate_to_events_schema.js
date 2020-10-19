'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddColumnDigitalCertificateToEventsSchema extends Schema {
  up () {
    this.table('events', (table) => {
      // alter table
      table
        .boolean('digital_certificate')
        .notNullable()
        .defaultTo(false)
    })
  }

  down () {
    this.table('events', (table) => {
      // reverse alternations
      table.dropColumn('digital_certificate')
    })
  }
}

module.exports = AddColumnDigitalCertificateToEventsSchema
