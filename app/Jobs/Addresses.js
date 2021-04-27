"use strict";

const Env = use("Env");

const axios = require("axios");

const api = axios.default.create({
  baseURL: "https://5260046.restlets.api.netsuite.com/app/site/hosting",
});

class Addresses {
  // If this getter isn't provided, it will default to 1.
  // Increase this number to increase processing concurrency.
  static get concurrency() {
    return 1;
  }

  // This is required. This is a unique key used to identify this job.
  static get key() {
    if (Env.get("NODE_ENV") === "development") {
      return "Addresses-job-development";
    } else {
      return "Addresses-job-production-3";
    }
  }

  // This is where the work is done.
  async handle({ netsuite_id, netsuiteAddresses }) {
    console.log("Addresses-job started");

    const obj = new Help();
    const OAuth = obj.display();

    console.log("Antes de enviar netsuite");

    const response = await api
      .post(
        "/restlet.nl?script=186&deploy=1",
        {
          netsuite_id,
          netsuiteAddresses,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: OAuth,
          },
        }
      )
      .catch((e) => {
        console.log("log do catch address", e);
        return true;
      });

    console.log(response.data);
  }
}

module.exports = Addresses;
