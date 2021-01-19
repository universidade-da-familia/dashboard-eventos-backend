"use strict";

const Env = use("Env");

const Entity = use("App/Models/Entity");

const axios = require("axios");

const api = axios.default.create({
  baseURL: "https://5260046.restlets.api.netsuite.com/app/site/hosting",
});

class CreateEntity {
  // If this getter isn't provided, it will default to 1.
  // Increase this number to increase processing concurrency.
  static get concurrency() {
    return 1;
  }

  // This is required. This is a unique key used to identify this job.
  static get key() {
    if (Env.get("NODE_ENV") === "development") {
      return "CreateEntity-job-development";
    } else {
      return "CreateEntity-job-production";
    }
  }

  // This is where the work is done.
  async handle({ entity, OAuth }) {
    console.log("CreateEntity-job started");

    const { id, name, email, cpf, sex } = entity;

    const fullname = name.split(" ");
    const firstname = fullname[0];
    fullname.shift();
    const lastname = fullname.length >= 1 ? fullname.join(" ") : "";

    const response = await api
      .post(
        "/restlet.nl?script=162&deploy=1",
        {
          is_business: false,
          id,
          name,
          firstname,
          lastname,
          email: email || "",
          cpf_cnpj: cpf || "",
          sex: sex || "",
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: OAuth,
          },
        }
      )
      .catch((e) => {
        console.log("log do catch", e);
        return true;
      });

    // console.log(JSON.stringify(response));

    console.log(response);

    if (response.data.id) {
      const entity = await Entity.findOrFail(id);

      entity.netsuite_id = response.data.id || entity.netsuite_id;

      await entity.save();

      console.log("Chamada ao netsuite finalizada com sucesso (CreateEntity).");

      return response.data.id;
    } else {
      console.log("Chamada ao netsuite finalizada com falha (CreateEntity).");
      throw new Error({
        title: "Falha!",
        message: "Houve um erro ao criar a entidade no Netsuite.",
      });
    }
  }
}

module.exports = CreateEntity;
