'use strict'

const Entity = use('App/Models/Entity')
const Hash = use('Hash')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with changepasswords
 */
class ChangePasswordController {
  /**
   * Update user details.
   * PUT or PATCH users/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response, auth }) {
    try {
      const data = request.only(['password', 'newPassword'])

      const entity = await Entity.findOrFail(params.id)

      const token = await auth
        .authenticator('jwt_entity')
        .attempt(entity.email, data.password)

      if (token) {
        entity.password = data.newPassword
      }

      await entity.save()

      return entity
    } catch (err) {
      return response.status(err.status).send({
        title: 'Falha!',
        message: 'Senha atual incorreta.'
      })
    }
  }
}

module.exports = ChangePasswordController
