"use strict";

const Order = use("App/Models/Order");

const axios = require("axios");

const api = axios.default.create({
  baseURL: "https://5260046.restlets.api.netsuite.com/app/site/hosting",
  headers: {
    "Content-Type": "application/json",
    Authorization:
      "NLAuth nlauth_account=5260046, nlauth_email=lucas.alves@udf.org.br, nlauth_signature=0rZFiwRE!!@@##,nlauth_role=1077"
  }
});

class CreateOrder {
  // If this getter isn't provided, it will default to 1.
  // Increase this number to increase processing concurrency.
  static get concurrency() {
    return 1;
  }

  // This is required. This is a unique key used to identify this job.
  static get key() {
    return "CreateOrder-job";
  }

  // This is where the work is done.
  async handle({ id }) {
    console.log(`Job: ${CreateOrder.key}`);

    const order = await Order.findOrFail(id);

    await order.loadMany([
      "status",
      "transactions",
      "organization",
      "entity",
      "products"
    ]);

    const response = await api.post("/restlet.nl?script=179&deploy=1", order);

    order.netsuite_id = response.data.id || order.netsuite_id;

    await order.save();
  }
}

module.exports = CreateOrder;
