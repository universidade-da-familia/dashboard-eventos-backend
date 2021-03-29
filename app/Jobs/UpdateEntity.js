"use strict";

const Env = use("Env");

const HelpUpdate = use("App/Helpers/update_entity_helper");

const axios = require("axios");

const api = axios.default.create({
  baseURL: "https://5260046.restlets.api.netsuite.com/app/site/hosting",
});

class UpdateEntity {
  // If this getter isn't provided, it will default to 1.
  // Increase this number to increase processing concurrency.
  static get concurrency() {
    return 1;
  }

  // This is required. This is a unique key used to identify this job.
  static get key() {
    if (Env.get("NODE_ENV") === "development") {
      return "UpdateEntity-job-development";
    } else {
      return "UpdateEntity-job-production-1";
    }
  }

  // This is where the work is done.
  async handle({ entity }) {
    console.log("UpdateEntity-job started");

    const obj_update = new HelpUpdate();
    const OAuthUpdate = obj_update.display();

    const {
      id,
      netsuite_id,
      personal_state_id,
      name,
      email,
      cpf: cpf_cnpj,
      sex,
      phone,
      alt_phone,
      church,
      cmn_hierarchy_id,
      mu_hierarchy_id,
      crown_hierarchy_id,
      mp_hierarchy_id,
      ffi_hierarchy_id,
      gfi_hierarchy_id,
      pg_hab_hierarchy_id,
      pg_yes_hierarchy_id,
    } = entity;

    const fullname = name.split(" ");
    const firstname = fullname[0];
    fullname.shift();
    const lastname = fullname.length >= 1 ? fullname.join(" ") : "";

    const response = await api
      .put(
        "/restlet.nl?script=182&deploy=1",
        {
          is_business: false,
          id,
          netsuite_id,
          personal_state_id: personal_state_id,
          name,
          firstname,
          lastname,
          email: email || "",
          cpf_cnpj: cpf_cnpj || "",
          sex: sex || "",
          phone: phone || "",
          alt_phone: alt_phone || "",
          church_netsuite_id: church ? church.netsuite_id : "",
          cmn_hierarchy_id,
          mu_hierarchy_id,
          crown_hierarchy_id,
          mp_hierarchy_id,
          ffi_hierarchy_id,
          gfi_hierarchy_id,
          pg_hab_hierarchy_id,
          pg_yes_hierarchy_id,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: OAuthUpdate,
          },
        }
      )
      .catch((e) => {
        console.log("log do catch update-entity", e);
        return true;
      });

    console.log(response.data);

    if (response.data.id) {
      console.log("Chamada ao netsuite finalizada com sucesso (UpdateEntity).");
    } else {
      console.log("Chamada ao netsuite finalizada com falha (UpdateEntity).");
      throw new Error({
        title: "Falha!",
        message: "Houve um erro ao editar a entidade no Netsuite.",
      });
    }
  }
}

module.exports = UpdateEntity;
