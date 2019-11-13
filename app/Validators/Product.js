"use strict";

const Antl = use("Antl");

class Product {
  get validateAll() {
    return true;
  }

  get rules() {
    return {
      name: "required",
      unit_price: "required",
      netsuite_id: "required"
    };
  }

  get messages() {
    return Antl.list("validation");
  }
}

module.exports = Product;
