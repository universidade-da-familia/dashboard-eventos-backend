"use strict";

const Order = use("App/Models/Order");

const axios = require("axios");

const { OAuth } = use("App/Helpers/netsuite_api");

const api = axios.default.create({
  baseURL: "https://5260046.restlets.api.netsuite.com/app/site/hosting",
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
  async handle({ orderNetsuite, order_id }) {
    console.log("CreateOrder-job started");

    const response = await api.post(
      "/restlet.nl?script=185&deploy=1",
      orderNetsuite,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: OAuth,
        },
      }
    );

    console.log(response.data);

    if (response.data.id) {
      console.log("Chamada ao netsuite finalizada com sucesso (CreateOrder).");
      const order = await Order.findOrFail(order_id);

      order.netsuite_id = response.data.id || order.netsuite_id;

      await order.save();
    } else {
      console.log("Chamada ao netsuite finalizada com falha (CreateOrder).");
      throw new Error({
        title: "Falha!",
        message: "Houve um erro ao gerar o pedido no Netsuite.",
      });
    }
  }
}

module.exports = CreateOrder;
