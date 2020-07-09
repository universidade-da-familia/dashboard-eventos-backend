'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddColumnMainAddressToAddressSchema extends Schema {
  up () {
    this.table('addresses', (table) => {
      // alter table
      table
        .boolean('main_address')
        .notNullable()
        .defaultTo(false)
    })
  }

  down () {
    this.table('addresses', (table) => {
      // reverse alternations
      table.dropColumn('main_address')
    })
  }
}

module.exports = AddColumnMainAddressToAddressSchema
