"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class DefaultEventSchedule extends Model {
  defaultEvent() {
    return this.belongsTo("App/Models/DefaultEvent");
  }
}

module.exports = DefaultEventSchedule;
