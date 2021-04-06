"use strict";

const Env = use("Env");

const Mail = use("Mail");
const moment = require("moment");
moment.locale("pt-BR");

class FinishInscriptions {
  // If this getter isn't provided, it will default to 1.
  // Increase this number to increase processing concurrency.
  static get concurrency() {
    return 1;
  }

  // This is required. This is a unique key used to identify this job.
  static get key() {
    if (Env.get("NODE_ENV") === "development") {
      return "FinishInscriptions-job-development";
    } else {
      return "FinishInscriptions-job-production";
    }
  }

  // This is where the work is done.
  async handle(data) {
    console.log("FinishInscriptions-job started");
    console.log("TESTE ERICK");

    let email = "";

    if (data.defaultEvent.event_type === "Curso") {
      email = data.defaultEvent.ministery.email;
    } else if (
      data.defaultEvent.event_type === "Capacitação de líderes" ||
      data.defaultEvent.event_type === "Treinamento de treinadores"
    ) {
      email = data.defaultEvent.ministery.training_email;
    } else if (data.defaultEvent.event_type === "Seminário") {
      email = data.defaultEvent.ministery.seminary_email;
    }

    console.log("EMAIL ENVIADO", email);

    const organizator = data.organizators[0];

    await Mail.send(
      ["emails.finish_inscription", "emails.finish_inscription-text"],
      {
        id: data.id,
        event_name: data.defaultEvent.name,
        participants: data.noQuitterParticipants.length,
        initial_date: moment(data.start_date).format("LLL"),
        organizator_name: organizator.name,
        organizator_cpf: organizator.cpf || "sem CPF",
        organizator_email: organizator.email || "sem email",
      },
      (message) => {
        message
          .to(email)
          .from("naoresponda@udf.org.br", "no-reply | Portal do Líder")
          .subject(`Inscrição finalizada - evento ${data.id}`);
      }
    );

    console.log("FinishInscriptions-job enviado com sucesso!");
  }
}

module.exports = FinishInscriptions;
