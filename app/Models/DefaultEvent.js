"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class DefaultEvent extends Model {
  ministery() {
    return this.belongsTo("App/Models/Ministery");
  }

  kit() {
    return this.belongsTo("App/Models/Kit");
  }

  layoutCertificate() {
    return this.belongsTo("App/Models/LayoutCertificate");
  }

  lessons() {
    return this.hasMany("App/Models/Lesson");
  }

  events() {
    return this.hasMany("App/Models/Event");
  }
}

module.exports = DefaultEvent;
