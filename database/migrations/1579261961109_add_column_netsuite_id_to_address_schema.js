'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddColumnNetsuiteIdToAddressSchema extends Schema {
  up () {
    this.table('addresses', (table) => {
      // alter table
      table.integer("netsuite_id").unsigned();
    })
  }

  down () {
    this.table('addresses', (table) => {
      // reverse alternations
      table.dropColumn('netsuite_id')
    })
  }
}

module.exports = AddColumnNetsuiteIdToAddressSchema
