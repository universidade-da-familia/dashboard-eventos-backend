"use strict";

const Model = use("Model");
const Hash = use("Hash");

const Kue = use("Kue");
const Job = use("App/Jobs/CreateProspect");

const moment = require("moment");

class Entity extends Model {
  static boot() {
    super.boot();

    this.addHook("beforeSave", async userInstance => {
      if (userInstance.dirty.password) {
        userInstance.password = await Hash.make(userInstance.password);
      }
    });

    this.addHook("afterCreate", async entityInstance => {
      const { id, name, email, cpf } = entityInstance;

      const fullname = name.split(" ");
      const firstname = fullname[0];
      fullname.shift();
      const lastname = fullname.length >= 1 ? fullname.join(" ") : "";

      Kue.dispatch(
        Job.key,
        {
          is_business: false,
          id,
          name,
          firstname,
          lastname,
          email,
          cpf_cnpj: cpf
        },
        {
          attempts: 5
        }
      );
    });
  }

  static get computed() {
    return ["age"];
  }

  getAge({ birthday }) {
    const age = moment().diff(moment(birthday), "years", false);

    return age;
  }

  tokens() {
    return this.hasMany("App/Models/Token");
  }

  file() {
    return this.belongsTo("App/Models/File");
  }

  addresses() {
    return this.hasMany("App/Models/Address").orderBy("id");
  }

  creditCards() {
    return this.hasMany("App/Models/CreditCard");
  }

  checkouts() {
    return this.hasMany("App/Models/Checkout");
  }

  checkoutItems() {
    return this.hasMany("App/Models/CheckoutItem");
  }

  families() {
    return this.belongsToMany("App/Models/Family")
      .pivotTable("entity_families")
      .withPivot(["relationship"])
      .withTimestamps();
  }

  entityOrganizations() {
    return this.belongsToMany("App/Models/Organization")
      .pivotTable("entity_organizations")
      .withPivot(["role", "can_checkout"])
      .withTimestamps();
  }

  organizators() {
    return this.belongsToMany("App/Models/Event")
      .pivotTable("organizators")
      .withTimestamps();
  }

  participants() {
    return this.belongsToMany("App/Models/Event")
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

  orders() {
    return this.hasMany("App/Models/Order");
  }
}

module.exports = Entity;
