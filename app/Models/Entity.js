"use strict";

const Model = use("Model");
const Hash = use("Hash");

const axios = require("axios");

const api = axios.default.create({
  baseURL: "https://5260046.restlets.api.netsuite.com/app/site/hosting",
  headers: {
    "Content-Type": "application/json",
    Authorization:
      "NLAuth nlauth_account=5260046, nlauth_email=lucas.alves@udf.org.br, nlauth_signature=TI@udf2019#@!,nlauth_role=1077"
  }
});

class Entity extends Model {
  static boot() {
    super.boot();

    this.addHook("beforeSave", async userInstance => {
      if (userInstance.dirty.password) {
        userInstance.password = await Hash.make(userInstance.password);
      }
    });

    this.addHook("afterCreate", async entityInstance => {
      const { name, email, cpf } = entityInstance;

      const fullname = name.split(" ");
      const firstname = fullname[0];
      fullname.shift();
      const lastname = fullname.length >= 1 ? fullname.join(" ") : "";

      const response = await api.post("/restlet.nl?script=162&deploy=1", {
        is_business: false,
        name,
        firstname,
        lastname,
        email,
        cpf_cnpj: cpf
      });

      entityInstance.netsuite_id = response.data.id;

      await entityInstance.save();
    });
  }

  tokens() {
    return this.hasMany("App/Models/Token");
  }

  file() {
    return this.belongsTo("App/Models/File");
  }

  addresses() {
    return this.hasMany("App/Models/Address");
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
      .withPivot(["assistant", "attendance_status", "event_authorization"])
      .withTimestamps();
  }
}

module.exports = Entity;
