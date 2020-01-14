'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Entity = use('App/Models/Entity')
const LessonReport = use('App/Models/LessonReport')
const Attendance = use('App/Models/Attendance')
const Event = use('App/Models/Event')

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
  async index ({ request, response }) {}

  /**
   * Render a form to be used for creating a new entityhierarchy.
   * GET entityhierarchies/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create ({ request, response }) {}

  /**
   * Create/save a new entityhierarchy.
   * POST entityhierarchies
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {}

  /**
   * Display a single entityhierarchy.
   * GET entityhierarchies/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response }) {}

  /**
   * Render a form to update an existing entityhierarchy.
   * GET entityhierarchies/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({ params, request, response }) {}

  /**
   * Update entityhierarchy details.
   * PUT or PATCH entityhierarchies/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request }) {
    const { entitiesId, hierarchyName, hierarchyWillBecome } = request.only([
      'entitiesId',
      'hierarchyName',
      'hierarchyWillBecome'
    ])

    const event = await Event.findOrFail(params.event_id)
    await event.load('defaultEvent')

    const lessonReportsId = await LessonReport.query()
      .select('id')
      .where('event_id', params.event_id)
      .pluck('id')

    const attendances = await Attendance.query()
      .whereIn('lesson_report_id', lessonReportsId)
      .with('participant')
      .fetch()

    let count = 0

    const approvedEntities = entitiesId.filter(entity => {
      count = 0

      attendances.toJSON().map(attendance => {
        if (attendance.participant.entity_id === entity) {
          if (!attendance.is_present) {
            count += 1
          }
        }
      })

      if (count <= event.toJSON().defaultEvent.max_faults) {
        return entity
      }
    })

    const entities = Entity.updateHierarchy(approvedEntities, hierarchyName, hierarchyWillBecome)

    return entities
  }

  /**
   * Delete a entityhierarchy with id.
   * DELETE entityhierarchies/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {}
}

module.exports = EntityHierarchyController
