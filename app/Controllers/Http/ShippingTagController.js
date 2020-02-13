'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Entity = use('App/Models/Entity')

/**
 * Resourceful controller for interacting with shippingtags
 */
class ShippingTagController {
  /**
   * Show a list of all shippingtags.
   * GET shippingtags
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request }) {
    const data = request.all()

    const leaders = Object.values(data).map(leader => {
      return leader.leader_id
    })

    const entities = await Entity.query()
      .with('addresses')
      .whereIn('id', leaders)
      .fetch()

    return entities
  }

  /**
   * Render a form to be used for creating a new shippingtag.
   * GET shippingtags/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create ({ request, response, view }) {
  }

  /**
   * Create/save a new shippingtag.
   * POST shippingtags
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
  }

  /**
   * Display a single shippingtag.
   * GET shippingtags/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
  }

  /**
   * Render a form to update an existing shippingtag.
   * GET shippingtags/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update shippingtag details.
   * PUT or PATCH shippingtags/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
  }

  /**
   * Delete a shippingtag with id.
   * DELETE shippingtags/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
  }
}

module.exports = ShippingTagController
