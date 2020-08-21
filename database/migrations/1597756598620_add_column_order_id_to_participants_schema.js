'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddColumnOrderIdToParticipantsSchema extends Schema {
  up () {
    this.table('participants', (table) => {
      // alter table
      table
        .integer('order_id')
        .unsigned()
        .references('id')
        .inTable('orders')
        .onUpdate('CASCADE')
        .onDelete('SET NULL')
    })
  }

  down () {
    this.table('participants', (table) => {
      // reverse alternations
      table.dropColumn('order_id')
    })
  }
}

module.exports = AddColumnOrderIdToParticipantsSchema
