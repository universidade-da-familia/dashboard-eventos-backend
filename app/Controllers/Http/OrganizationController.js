"use strict";

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Organization = use("App/Models/Organization");

/**
 * Resourceful controller for interacting with organizations
 */
class OrganizationController {
  /**
   * Show a list of all organizations.
   * GET organizations
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index() {
    const organization = await Organization.all();

    return organization;
  }

  /**
   * Create/save a new organization.
   * POST organizations
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {
    try {
      const data = request.all();

      const organization = await Organization.create(data);

      return organization;
    } catch (err) {
      return response.status(err.status).send({
        error: {
          title: "Falha!",
          message: "Erro ao criar a organização"
        }
      });
    }
  }

  /**
   * Display a single organization.
   * GET organizations/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, response }) {
    try {
      const organization = await Organization.findOrFail(params.id);

      await organization.loadMany([
        "file",
        "creditCards",
        "addresses",
        "checkouts",
        "events.defaultEvent.ministery",
        "entityOrganizations"
      ]);

      return organization;
    } catch (err) {
      return response.status(err.status).send({
        error: {
          title: "Falha!",
          message: "Erro ao mostrar a organização"
        }
      });
    }
  }

  /**
   * Update organization details.
   * PUT or PATCH organizations/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {
    try {
      const data = request.all();

      const organization = await Organization.findOrFail(params.id);

      organization.merge(data);

      await organization.save();

      return organization;
    } catch (err) {
      return response.status(err.status).send({
        error: {
          title: "Falha!",
          message: "Erro ao atualizar a organização"
        }
      });
    }
  }

  /**
   * Delete a organization with id.
   * DELETE organizations/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response }) {
    try {
      const organization = await Organization.findOrFail(params.id);

      await organization.delete();

      return response.status(200).send({
        title: "Sucesso!",
        message: "A organização foi removida."
      });
    } catch (err) {
      return response.status(err.status).send({
        error: {
          title: "Falha!",
          message: "Erro ao deletar a organização"
        }
      });
    }
  }
}

module.exports = OrganizationController;
