"use strict";

class CreateProspect {
  static get concurrency() {
    return 1;
  }

  static get key() {
    return "CreateProspect-job";
  }

  async handle({ id, name, firstname, lastname, email, cpf }) {}
}

module.exports = CreateProspect;
