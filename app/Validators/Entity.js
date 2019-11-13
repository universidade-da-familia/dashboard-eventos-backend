"use strict";

const Antl = use("Antl");

class Entity {
  get validateAll() {
    return true;
  }

  get rules() {
    return {
      name: "required",
      email: "required|email|unique:entities",
      cpf: "required|unique:entities",
      password: "min:6"
    };
  }

  get messages() {
    return Antl.list("validation");
  }
}

module.exports = Entity;
