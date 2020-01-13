'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Event = use('App/Models/Event')
const Entity = use('App/Models/Entity')
const DefaultEvent = use('App/Models/DefaultEvent')

/**
 * Resourceful controller for interacting with organizators
 */
class EventOrganizatorController {
  /**
   * Show a list of all organizators.
   * GET organizators
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ params }) {
    const event = await Event.findOrFail(params.event_id)
    const organizators = event.organizators().fetch()

    return organizators
  }

  /**
   * Create/save a new organizator.
   * POST organizators
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
    const { event_id, entity_id } = request.only(['event_id', 'entity_id'])

    const event = await Event.findOrFail(event_id)
    const entity = await Entity.findOrFail(entity_id)

    await entity.load('participants')

    const event_participant = entity
      .toJSON()
      .participants.find(participant => participant.id === parseInt(event_id))

    if (event_participant === undefined) {
      await event.organizators().attach(entity_id)

      await event.organizators().fetch()
    } else {
      return response.status(404).send({
        error: {
          title: 'Falha!',
          message: 'O CPF é de um participante inscrito'
        }
      })
    }

    return event
  }

  /**
   * Display a single organizator.
   * GET organizators/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
    try {
      const defaultEvent = await DefaultEvent.findOrFail(
        params.default_event_id
      )

      const ministery_id = defaultEvent.ministery_id
      const organizator_hierarchy_id = defaultEvent.organizator_hierarchy_id
      const assistant_hierarchy_id = defaultEvent.assistant_hierarchy_id
      const sex_type = defaultEvent.sex_type
      const organizator_type = params.organizator_type

      const organizator = await Entity.findByOrFail('cpf', params.cpf)

      await organizator.loadMany([
        'file',
        'families',
        'organizators.defaultEvent.ministery',
        'participants.defaultEvent.ministery',
        'creditCards',
        'addresses',
        'checkouts',
        'checkoutItems'
      ])

      if (organizator.sex === sex_type || sex_type === 'A') {
        if (ministery_id === 1) {
          if (organizator_type === 'leader') {
            if (organizator.cmn_hierarchy_id >= organizator_hierarchy_id) {
              return organizator
            } else {
              return response.status(200).send({
                error: {
                  title: 'Aviso!',
                  message: 'O CPF Informado não é de um líder válido'
                }
              })
            }
          } else if (organizator_type === 'training_leader') {
            if (organizator.cmn_hierarchy_id >= assistant_hierarchy_id) {
              return organizator
            } else {
              return response.status(200).send({
                error: {
                  title: 'Aviso!',
                  message: 'O CPF Informado não pode ser assistente'
                }
              })
            }
          }
        }
        if (ministery_id === 2) {
          if (organizator_type === 'leader') {
            if (organizator.mu_hierarchy_id >= organizator_hierarchy_id) {
              return organizator
            } else {
              return response.status(200).send({
                error: {
                  title: 'Aviso!',
                  message: 'O CPF Informado não é de um líder válido'
                }
              })
            }
          } else if (organizator_type === 'training_leader') {
            if (organizator.mu_hierarchy_id >= assistant_hierarchy_id) {
              return organizator
            } else {
              return response.status(200).send({
                error: {
                  title: 'Aviso!',
                  message: 'O CPF Informado não pode ser assistente'
                }
              })
            }
          }
        }
        if (ministery_id === 3) {
          if (organizator_type === 'leader') {
            if (organizator.crown_hierarchy_id >= organizator_hierarchy_id) {
              return organizator
            } else {
              return response.status(200).send({
                error: {
                  title: 'Aviso!',
                  message: 'O CPF Informado não é de um líder válido'
                }
              })
            }
          } else if (organizator_type === 'training_leader') {
            if (organizator.crown_hierarchy_id >= assistant_hierarchy_id) {
              return organizator
            } else {
              return response.status(200).send({
                error: {
                  title: 'Aviso!',
                  message: 'O CPF Informado não pode ser assistente'
                }
              })
            }
          }
        }
        if (ministery_id === 4) {
          if (organizator_type === 'leader') {
            if (organizator.mp_hierarchy_id >= organizator_hierarchy_id) {
              return organizator
            } else {
              return response.status(200).send({
                error: {
                  title: 'Aviso!',
                  message: 'O CPF Informado não é de um líder válido'
                }
              })
            }
          } else if (organizator_type === 'training_leader') {
            if (organizator.mp_hierarchy_id >= assistant_hierarchy_id) {
              return organizator
            } else {
              return response.status(200).send({
                error: {
                  title: 'Aviso!',
                  message: 'O CPF Informado não pode ser assistente'
                }
              })
            }
          }
        }
        if (ministery_id === 5) {
          if (organizator_type === 'leader') {
            if (organizator.ffi_hierarchy_id >= organizator_hierarchy_id) {
              return organizator
            } else {
              return response.status(200).send({
                error: {
                  title: 'Aviso!',
                  message: 'O CPF Informado não é de um líder válido'
                }
              })
            }
          } else if (organizator_type === 'training_leader') {
            if (organizator.ffi_hierarchy_id >= assistant_hierarchy_id) {
              return organizator
            } else {
              return response.status(200).send({
                error: {
                  title: 'Aviso!',
                  message: 'O CPF Informado não pode ser assistente'
                }
              })
            }
          }
        }
        if (ministery_id === 6) {
          if (organizator_type === 'leader') {
            if (organizator.gfi_hierarchy_id >= organizator_hierarchy_id) {
              return organizator
            } else {
              return response.status(200).send({
                error: {
                  title: 'Aviso!',
                  message: 'O CPF Informado não é de um líder válido'
                }
              })
            }
          } else if (organizator_type === 'training_leader') {
            if (organizator.gfi_hierarchy_id >= assistant_hierarchy_id) {
              return organizator
            } else {
              return response.status(200).send({
                error: {
                  title: 'Aviso!',
                  message: 'O CPF Informado não pode ser assistente'
                }
              })
            }
          }
        }
        if (ministery_id === 7) {
          if (organizator_type === 'leader') {
            if (organizator.pg_hab_hierarchy_id >= organizator_hierarchy_id) {
              return organizator
            } else {
              return response.status(200).send({
                error: {
                  title: 'Aviso!',
                  message: 'O CPF Informado não é de um líder válido'
                }
              })
            }
          } else if (organizator_type === 'training_leader') {
            if (organizator.pg_hab_hierarchy_id >= assistant_hierarchy_id) {
              return organizator
            } else {
              return response.status(200).send({
                error: {
                  title: 'Aviso!',
                  message: 'O CPF Informado não pode ser assistente'
                }
              })
            }
          }
        }
        if (ministery_id === 8) {
          if (organizator_type === 'leader') {
            if (organizator.pg_yes_hierarchy_id >= organizator_hierarchy_id) {
              return organizator
            } else {
              return response.status(200).send({
                error: {
                  title: 'Aviso!',
                  message: 'O CPF Informado não é de um líder válido'
                }
              })
            }
          } else if (organizator_type === 'training_leader') {
            if (organizator.pg_yes_hierarchy_id >= assistant_hierarchy_id) {
              return organizator
            } else {
              return response.status(200).send({
                error: {
                  title: 'Aviso!',
                  message: 'O CPF Informado não pode ser assistente'
                }
              })
            }
          }
        }
      } else {
        if (sex_type === 'M') {
          return response.status(200).send({
            error: {
              title: 'Aviso!',
              message: 'Evento exclusivo para o sexo masculino.'
            }
          })
        } else {
          return response.status(200).send({
            error: {
              title: 'Aviso!',
              message: 'Evento exclusivo para o sexo feminino.'
            }
          })
        }
      }
    } catch (err) {
      return response.status(err.status).send({
        error: {
          title: 'Falha!',
          message: 'Nenhum líder foi encontrado com este cpf'
        }
      })
    }
  }

  /**
   * Render a form to update an existing organizator.
   * GET organizators/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({ params, request, response, view }) {}

  /**
   * Update organizator details.
   * PUT or PATCH organizators/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {}

  /**
   * Delete a organizator with id.
   * DELETE organizators/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
    try {
      // const { event_id } = request.only(["event_id"]);
      const entity_id = params.entity_id
      const event_id = params.event_id

      const event = await Event.findOrFail(event_id)

      await event.organizators().detach(entity_id)
      await event.organizators().fetch()

      return response.status(200).send({
        title: 'Sucesso!',
        message: 'O organizador foi removido do evento.'
      })
    } catch (error) {
      return response.status(error.status).send({
        error: {
          title: 'Falha!',
          message: 'Erro ao excluir o organizador no evento'
        }
      })
    }
  }
}

module.exports = EventOrganizatorController
