"use strict";

const Model = use("Model");
const Env = use("Env");

class File extends Model {
  static get computed() {
    return ["url"];
  }

  getUrl({ id }) {
    return `${Env.get("APP_URL")}/image/${id}`;
  }

  entity() {
    return this.hasOne("App/Models/Entity");
  }

  organization() {
    return this.hasOne("App/Models/Organization");
  }
}

module.exports = File;
