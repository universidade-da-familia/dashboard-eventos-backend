"use strict";

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const DefaultEvent = use("App/Models/DefaultEvent");
const Database = use("Database");

/**
 * Resourceful controller for interacting with defaultevents
 */
class DefaultEventController {
  /**
   * Show a list of all defaultevents.
   * GET defaultevents
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */

  async organizator_events({ request }) {
    const {
      cmn_hierarchy_id,
      mu_hierarchy_id,
      crown_hierarchy_id,
      mp_hierarchy_id,
      ffi_hierarchy_id,
      gfi_hierarchy_id,
      pg_hierarchy_id
    } = request.only([
      "cmn_hierarchy_id",
      "mu_hierarchy_id",
      "crown_hierarchy_id",
      "mp_hierarchy_id",
      "ffi_hierarchy_id",
      "gfi_hierarchy_id",
      "pg_hierarchy_id"
    ]);

    const cmn = await DefaultEvent.query()
      .where("organizator_hierarchy_id", "<=", cmn_hierarchy_id)
      .andWhere("ministery_id", 1)
      .with("ministery")
      .with("kit.products")
      .fetch();

    const mu = await DefaultEvent.query()
      .where("organizator_hierarchy_id", "<=", mu_hierarchy_id)
      .andWhere("ministery_id", 2)
      .with("ministery")
      .with("kit.products")
      .fetch();

    const crown = await DefaultEvent.query()
      .where("organizator_hierarchy_id", "<=", crown_hierarchy_id)
      .andWhere("ministery_id", 3)
      .with("ministery")
      .with("kit.products")
      .fetch();

    const mp = await DefaultEvent.query()
      .where("organizator_hierarchy_id", "<=", mp_hierarchy_id)
      .andWhere("ministery_id", 4)
      .with("ministery")
      .with("kit.products")
      .fetch();

    const ffi = await DefaultEvent.query()
      .where("organizator_hierarchy_id", "<=", ffi_hierarchy_id)
      .andWhere("ministery_id", 5)
      .with("ministery")
      .with("kit.products")
      .fetch();

    const gfi = await DefaultEvent.query()
      .where("organizator_hierarchy_id", "<=", gfi_hierarchy_id)
      .andWhere("ministery_id", 6)
      .with("ministery")
      .with("kit.products")
      .fetch();

    const pg = await DefaultEvent.query()
      .where("organizator_hierarchy_id", "<=", pg_hierarchy_id)
      .andWhere("ministery_id", 7)
      .with("ministery")
      .with("kit.products")
      .fetch();

    const defaults = [
      ...cmn.toJSON(),
      ...mu.toJSON(),
      ...crown.toJSON(),
      ...mp.toJSON(),
      ...ffi.toJSON(),
      ...gfi.toJSON(),
      ...pg.toJSON()
    ];

    return defaults;
  }

  async index() {
    const defaultEvents = DefaultEvent.query()
      .with("ministery")
      .fetch();

    return defaultEvents;
  }

  /**
   * Create/save a new defaultevent.
   * POST defaultevents
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {
    try {
      const data = request.all();

      const defaultEvent = await DefaultEvent.create(data);

      return defaultEvent;
    } catch (err) {
      return response.status(err.status).send({
        error: {
          title: "Falha!",
          message: "Erro ao criar o evento padrão"
        }
      });
    }
  }

  /**
   * Display a single defaultevent.
   * GET defaultevents/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, response }) {
    const defaultEvent = await DefaultEvent.findOrFail(params.id);

    await defaultEvent.loadMany([
      "kit.products",
      "layoutCertificate",
      "lessons"
    ]);

    return defaultEvent;
  }

  /**
   * Update defaultevent details.
   * PUT or PATCH defaultevents/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {
    try {
      const data = request.all();

      const defaultEvent = await DefaultEvent.findOrFail(params.id);

      defaultEvent.merge(data);

      await defaultEvent.save();

      return defaultEvent;
    } catch (err) {
      return response.status(err.status).send({
        error: {
          title: "Falha!",
          message: "Erro ao atualizar o evento padrão"
        }
      });
    }
  }

  /**
   * Delete a defaultevent with id.
   * DELETE defaultevents/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, response }) {
    try {
      const defaultEvent = await DefaultEvent.findOrFail(params.id);

      await defaultEvent.delete();

      return response.status(200).send({
        title: "Sucesso!",
        message: "O evento padrão foi removido."
      });
    } catch (err) {
      return response.status(err.status).send({
        error: {
          title: "Falha!",
          message: "Erro ao deletar o evento padrão"
        }
      });
    }
  }
}

module.exports = DefaultEventController;
