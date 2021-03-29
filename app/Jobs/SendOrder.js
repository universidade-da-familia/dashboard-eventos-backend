"use strict";

const Env = use("Env");

const Mail = use("Mail");
const moment = require("moment");
moment.locale("pt-BR");

class SendOrder {
  // If this getter isn't provided, it will default to 1.
  // Increase this number to increase processing concurrency.
  static get concurrency() {
    return 1;
  }

  // This is required. This is a unique key used to identify this job.
  static get key() {
    if (Env.get("NODE_ENV") === "development") {
      return "SendOrder-job-development";
    } else {
      return "SendOrder-job-production-1";
    }
  }

  // This is where the work is done.
  async handle(data) {
    console.log("SendOrder-job started");

    const { entity, order } = data;

    await Mail.send(
      ["emails.order", "emails.order-text"],
      {
        name: entity.name,
        created_at: moment(order.created_at).format("LLL"),
        id: order.id || "Sem pedido",
        shipping_receiver: order.shipping_receiver || "Não informado",
        shipping_street: order.shipping_street || "Não informado",
        shipping_number: order.shipping_number || "Não informado",
        shipping_complement: order.shipping_complement || "Não informado",
        shipping_neighborhood: order.shipping_neighborhood || "Não informado",
        shipping_city: order.shipping_city || "Não informado",
        shipping_uf: order.shipping_uf || "Não informado",
        shipping_cep: order.shipping_cep || "Não informado",
      },
      (message) => {
        message
          .to(entity.email)
          .from("naoresponda@udf.org.br", "UDF | Portal do Líder")
          .subject(`Dados do pedido - Pedido ${order.id}`);
      }
    );

    console.log("SendOrder-job enviado com sucesso!");
  }
}

module.exports = SendOrder;
