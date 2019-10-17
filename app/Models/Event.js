"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Event extends Model {
  static get computed() {
    return ["status"];
  }

  getStatus() {
    const currentDate = new Date();
    const event = this.$attributes;

    if (event.is_finished === true) return "Finalizado";

    if (currentDate < event.start_date) {
      return "Não iniciado";
    } else if (currentDate >= event.start_date) {
      return "Em andamento";
    }
  }

  defaultEvent() {
    return this.belongsTo("App/Models/DefaultEvent");
  }

  programmations() {
    return this.hasMany("App/Models/Programmation");
  }

  lessonReports() {
    return this.hasMany("App/Models/LessonReport");
  }

  invites() {
    return this.hasMany("App/Models/Invite");
  }

  checkoutItems() {
    return this.hasMany("App/Models/CheckoutItems");
  }

  organizators() {
    return this.belongsToMany("App/Models/Entity")
      .pivotTable("organizators")
      .withTimestamps();
  }

  participants() {
    return this.belongsToMany("App/Models/Entity")
      .pivotTable("participants")
      .withPivot([
        "id",
        "assistant",
        "attendance_status",
        "is_quitter",
        "event_authorization"
      ])
      .withTimestamps();
  }

  organization() {
    return this.belongsTo(
      "App/Models/Organization",
      "responsible_organization_id",
      "id"
    );
  }
}

module.exports = Event;
