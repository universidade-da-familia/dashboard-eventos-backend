"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

const Kue = use("Kue");
const Job = use("App/Jobs/CreateOrder");

class Order extends Model {
  static boot() {
    super.boot();

    this.addHook("afterCreate", async orderInstance => {
      const { id } = orderInstance;

      Kue.dispatch(
        Job.key,
        {
          id
        },
        {
          attempts: 5
        }
      );
    });
  }

  status() {
    return this.belongsTo("App/Models/Status");
  }

  coupon() {
    return this.belongsTo("App/Models/Coupon");
  }

  organization() {
    return this.belongsTo("App/Models/Organization");
  }

  entity() {
    return this.belongsTo("App/Models/Entity");
  }

  products() {
    return this.belongsToMany("App/Models/Product")
      .pivotTable("order_products")
      .withPivot(["quantity"])
      .withTimestamps();
  }

  transactions() {
    return this.hasMany("App/Models/OrderTransaction");
  }
}

module.exports = Order;
