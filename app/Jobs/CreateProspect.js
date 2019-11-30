"use strict";

const Entity = use("App/Models/Entity");

const axios = require("axios");

const api = axios.default.create({
  baseURL: "https://5260046.restlets.api.netsuite.com/app/site/hosting",
  headers: {
    "Content-Type": "application/json",
    Authorization:
      "NLAuth nlauth_account=5260046, nlauth_email=lucas.alves@udf.org.br, nlauth_signature=0rZFiwRE!!@@##,nlauth_role=1077"
  }
});

class CreateProspect {
  static get concurrency() {
    return 1;
  }

  static get key() {
    return "CreateProspect-job";
  }

  async handle({
    is_business,
    id,
    name,
    firstname,
    lastname,
    email,
    cpf_cnpj
  }) {
    console.log(`Job: ${CreateProspect.key}`);

    const response = await api.post("/restlet.nl?script=162&deploy=1", {
      is_business,
      id,
      name,
      firstname,
      lastname,
      email,
      cpf_cnpj
    });

    console.log(response.data);

    const entity = await Entity.findOrFail(id);

    entity.netsuite_id = response.data.id || entity.netsuite_id;
    entity.entity_type = "prospect" || entity.entity_type;

    await entity.save();
  }
}

module.exports = CreateProspect;
