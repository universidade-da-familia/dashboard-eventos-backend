"use strict";

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Entity = use("App/Models/Entity");

/**
 * Resourceful controller for interacting with entityhierarchies
 */
class EntityHierarchyController {
  /**
   * Show a list of all entityhierarchies.
   * GET entityhierarchies
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ request, response }) {}

  /**
   * Render a form to be used for creating a new entityhierarchy.
   * GET entityhierarchies/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create({ request, response }) {}

  /**
   * Create/save a new entityhierarchy.
   * POST entityhierarchies
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {}

  /**
   * Display a single entityhierarchy.
   * GET entityhierarchies/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, request, response }) {}

  /**
   * Render a form to update an existing entityhierarchy.
   * GET entityhierarchies/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit({ params, request, response }) {}

  /**
   * Update entityhierarchy details.
   * PUT or PATCH entityhierarchies/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ request }) {
    const { id, hierarchyName, hierarchyId } = request.only([
      "id",
      "hierarchyName",
      "hierarchyId"
    ]);

    const entities = Entity.updateHierarchy(id, hierarchyName, hierarchyId);

    return entities;
  }

  /**
   * Delete a entityhierarchy with id.
   * DELETE entityhierarchies/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response }) {}
}

module.exports = EntityHierarchyController;
