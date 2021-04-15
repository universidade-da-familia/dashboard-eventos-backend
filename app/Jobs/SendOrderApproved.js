"use strict";

const Env = use("Env");

const Mail = use("Mail");
const moment = require("moment");
moment.locale("pt-BR");

class SendOrderApproved {
  // If this getter isn't provided, it will default to 1.
  // Increase this number to increase processing concurrency.
  static get concurrency() {
    return 1;
  }

  // This is required. This is a unique key used to identify this job.
  static get key() {
    if (Env.get("NODE_ENV") === "development") {
      return "SendOrderApproved-job-development";
    } else {
      return "SendOrderApproved-job-production-3";
    }
  }

  // This is where the work is done.
  async handle(data) {
    console.log("SendOrderApproved-job started");

    const { entity, order } = data;

    await Mail.send(
      ["emails.order_approved", "emails.order_approved-text"],
      {
        name: entity.name,
        id: order.id || "Sem pedido",
        updated_at: moment(new Date()).format("LLL"),
      },
      (message) => {
        message
          .to(entity.email)
          .from("naoresponda@udf.org.br", "UDF | Portal do Líder")
          .subject(`Dados do pagamento - Pedido ${order.id}`);
      }
    );

    console.log("SendOrderApproved-job enviado com sucesso!");
  }
}

module.exports = SendOrderApproved;
