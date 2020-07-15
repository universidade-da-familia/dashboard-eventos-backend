'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddColumnAdminPrintDateToOrganizatorsSchema extends Schema {
  up () {
    this.table('organizators', (table) => {
      // alter table
      table.datetime('print_date')
    })
  }

  down () {
    this.table('organizators', (table) => {
      // reverse alternations
      table.dropColumn('print_date')
    })
  }
}

module.exports = AddColumnAdminPrintDateToOrganizatorsSchema
