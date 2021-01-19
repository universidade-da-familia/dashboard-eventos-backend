'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddColumnNfeLinkToOrdersSchema extends Schema {
  up () {
    this.table('orders', (table) => {
      // alter table
      table.string('nfe_link')
    })
  }

  down () {
    this.table('orders', (table) => {
      // reverse alternations
      table.dropColumn('nfe_link')
    })
  }
}

module.exports = AddColumnNfeLinkToOrdersSchema
