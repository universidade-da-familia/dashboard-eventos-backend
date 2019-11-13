"use strict";

const axios = require("axios");

const api = axios.default.create({
  baseURL: "https://5260046.restlets.api.netsuite.com/app/site/hosting",
  headers: {
    "Content-Type": "application/json",
    Authorization:
      "NLAuth nlauth_account=5260046, nlauth_email=lucas.alves@udf.org.br, nlauth_signature=TI@udf2019#@!,nlauth_role=1077"
  }
});

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with churches
 */
class ChurchController {
  /**
   * Show a list of all churches.
   * GET churches
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ request, response, view }) {}

  /**
   * Render a form to be used for creating a new church.
   * GET churches/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create({ request, response, view }) {}

  /**
   * Create/save a new church.
   * POST churches
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {}

  /**
   * Display a single church.
   * GET churches/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params }) {
    try {
      const response = await api.get(
        `/restlet.nl?script=124&deploy=1&uf=${params.uf}&city=${
          params.city
        }&name=${params.name}`
      );

      if(response.data.length === 0){
        return {
          error: {
            title: "Falha!",
            message: "Nenhuma igreja encontrada"
          }
        }
      }

      return response.data;
    } catch (err) {
      return response.status(err.status).send({
        error: {
          title: "Falha!",
          message: "Erro encontrado, tente novamente"
        }
      });
    }
  }

  /**
   * Render a form to update an existing church.
   * GET churches/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit({ params, request, response, view }) {}

  /**
   * Update church details.
   * PUT or PATCH churches/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {}

  /**
   * Delete a church with id.
   * DELETE churches/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response }) {}
}

module.exports = ChurchController;
