"use strict";

const Entity = use("App/Models/Entity");

const axios = require("axios");

const api = axios.default.create({
  baseURL: "https://5260046.restlets.api.netsuite.com/app/site/hosting",
  headers: {
    "Content-Type": "application/json",
    Authorization:
      "NLAuth nlauth_account=5260046, nlauth_email=lucas.alves@udf.org.br, nlauth_signature=TI@udf2019#@!,nlauth_role=1077"
  }
});

class CreateProspect {
  static get concurrency() {
    return 1;
  }

  static get key() {
    return "CreateProspect-job";
  }

  async handle({ id, name, firstname, lastname, email, cpf }) {
    console.log(`Job: ${CreateProspect.key}`);
    const response = await api.post("/restlet.nl?script=162&deploy=1", {
      is_business: false,
      name,
      firstname,
      lastname,
      email,
      cpf_cnpj: cpf
    });

    console.log(response.data);

    const entity = await Entity.findOrFail(id);

    entity.netsuite_id = response.data.id || entity.netsuite_id;

    await entity.save();
  }
}

module.exports = CreateProspect;
