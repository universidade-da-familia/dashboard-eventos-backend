'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddColumnModalityIdToEventsSchema extends Schema {
  up () {
    this.table('events', (table) => {
      // alter table
      table
        .enum('modality', ['Presencial', 'Online', 'Misto'])
        .defaultTo('Presencial')
    })
  }

  down () {
    this.table('events', (table) => {
      // reverse alternations
      table.dropColumn('modality')
    })
  }
}

module.exports = AddColumnModalityIdToEventsSchema
