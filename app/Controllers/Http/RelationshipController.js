'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Relationship = use('App/Models/Relationship')

/**
 * Resourceful controller for interacting with relationships
 */
class RelationshipController {
  /**
   * Show a list of all entity relationships.
   * GET relationships
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async indexEntity ({ params, request, response }) {
    const relationships = await Relationship.query()
      .where('entity_id', params.entity_id)
      .with('entity')
      .fetch()

    return relationships
  }

  /**
   * Create/save a new relationship.
   * POST relationships
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
    try {
      const { entity_id, relationship_id, relationship_type, relationship_sex } = request.all()

      const relationship = await Relationship.create({
        entity_id, relationship_id, relationship_type
      })

      if (relationship_type === 'Esposa') {
        await Relationship.create({
          entity_id: relationship_id, relationship_id: entity_id, relationship_type: 'Marido'
        })
      } else if (relationship_type === 'Marido') {
        await Relationship.create({
          entity_id: relationship_id, relationship_id: entity_id, relationship_type: 'Esposa'
        })
      } else if (relationship_type === 'Pai' || relationship_type === 'Mãe') {
        await Relationship.create({
          entity_id: relationship_id, relationship_id: entity_id, relationship_type: 'Filho'
        })
      } else if (relationship_type === 'Filho' && relationship_sex === 'M') {
        await Relationship.create({
          entity_id: relationship_id, relationship_id: entity_id, relationship_type: 'Pai'
        })
      } else if (relationship_type === 'Filho' && relationship_sex === 'F') {
        await Relationship.create({
          entity_id: relationship_id, relationship_id: entity_id, relationship_type: 'Mãe'
        })
      }

      return relationship
    } catch (err) {
      return response.status(err.status).send({
        title: 'Falha',
        message: 'Houve um erro ao adicionar o familiar'
      })
    }
  }

  /**
   * Update relationship details.
   * PUT or PATCH relationships/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
    try {
      const relationship = await Relationship.findOrFail(params.id)

      const data = request.all()

      relationship.merge(data)

      await relationship.save()

      return relationship
    } catch (error) {
      console.log(error)
      return response.status(error.status).send({
        title: 'Falha!',
        message: 'Erro ao editar familiar'
      })
    }
  }

  /**
   * Delete a relationship with id.
   * DELETE relationships/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, response }) {
    try {
      const relationship = await Relationship.findOrFail(params.id)

      const relative = await Relationship.query()
        .where('entity_id', relationship.relationship_id)
        .andWhere('relationship_id', relationship.entity_id)
        .first()

      await relationship.delete()

      await relative.delete()

      return response.status(200).send({
        title: 'Sucesso!',
        message: 'Familiar removido'
      })
    } catch (error) {
      console.log(error)
      return response.status(error.status).send({
        title: 'Falha!',
        message: 'Erro ao remover familiar'
      })
    }
  }
}

module.exports = RelationshipController
