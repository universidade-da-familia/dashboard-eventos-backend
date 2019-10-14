"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Product extends Model {
  kits() {
    return this.belongsToMany("App/Models/Kit")
      .pivotTable("kit_products")
      .withTimestamps();
  }
}

module.exports = Product;
