'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddColumnIsBuyerToInvitesSchema extends Schema {
  up () {
    this.table('invites', (table) => {
      // alter table
      table
        .boolean('is_buyer')
        .notNullable()
        .defaultTo(false)
    })
  }

  down () {
    this.table('invites', (table) => {
      // reverse alternations
      table.dropColumn('is_buyer')
    })
  }
}

module.exports = AddColumnIsBuyerToInvitesSchema
