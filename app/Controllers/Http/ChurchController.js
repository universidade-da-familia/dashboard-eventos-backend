'use strict'

const Organization = use('App/Models/Organization')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with churches
 */
class ChurchController {
  /**
   * Display a single church.
   * GET churches/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ response, params }) {
    const { uf, city, name } = params

    try {
      const church = await Organization.query()
        .where(function () {
          if (uf) {
            this.where('uf', uf)
          }

          if (city) {
            this.where('city', city)
          }

          if (name) {
            this.where('name', name)
          }
        })

      return church
    } catch (err) {
      return response.status(err.status).send({
        title: 'Falha!',
        message: 'Houve um erro ao buscar a igreja.'
      })
    }
  }
}

module.exports = ChurchController
