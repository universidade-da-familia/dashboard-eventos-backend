"use strict";

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Category = use("App/Models/Category");

class CategoryController {
  /**
   * Show a list of all categories.
   * GET categories
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index() {
    const categories = Category.query().fetch();

    return categories;
  }

  /**
   * Create/save a new category.
   * POST categories
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {
    try {
      const data = request.only(["name"]);

      const category = await Category.create(data);

      return category;
    } catch (err) {
      return response.status(err.status).send({
        error: {
          title: "Falha!",
          message: "Tente cadastrar novamente"
        }
      });
    }
  }

  /**
   * Display a single category.
   * GET categories/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, response }) {
    try {
      const category = await Category.findOrFail(params.id);

      return category;
    } catch (err) {
      return response.status(err.status).send({
        error: {
          title: "Falha!",
          message: "Nenhuma categoria encontrada."
        }
      });
    }
  }

  /**
   * Render a form to update an existing category.
   * GET categories/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit({ params, request, response, view }) {}

  /**
   * Update category details.
   * PUT or PATCH categories/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {
    try {
      const category = await Category.findOrFail(params.id);

      const data = request.all();

      category.merge(data);

      await category.save();

      return entity;
    } catch (err) {
      return response.status(err.status).send({
        error: {
          title: "Falha!",
          message: "Tente atualizar novamente"
        }
      });
    }
  }

  /**
   * Delete a category with id.
   * DELETE categories/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response }) {}
}

module.exports = CategoryController;
