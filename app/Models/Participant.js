'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Participant extends Model {
  // static get table() {
  //   return "participants";
  // }

  attendances () {
    return this.belongsToMany('App/Models/LessonReport')
      .pivotTable('attendances')
      .withPivot(['id', 'participant_id', 'lesson_report_id', 'is_present'])
      .withTimestamps()
  }

  order () {
    return this.belongsTo('App/Models/Order')
  }
}

module.exports = Participant
