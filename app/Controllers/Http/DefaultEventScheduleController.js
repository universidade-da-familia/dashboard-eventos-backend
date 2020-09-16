"use strict";

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const DefaultEventSchedule = use("App/Models/DefaultEventSchedule");

/**
 * Resourceful controller for interacting with defaulteventschedules
 */
class DefaultEventScheduleController {
  /**
   * Show a list of all defaulteventschedules.
   * GET defaulteventschedules
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ request, response, view }) {}

  /**
   * Render a form to be used for creating a new defaulteventschedule.
   * GET defaulteventschedules/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create({ request, response, view }) {}

  /**
   * Create/save a new defaulteventschedule.
   * POST defaulteventschedules
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {}

  /**
   * Display a single defaulteventschedule.
   * GET defaulteventschedules/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, request, response, view }) {
    const defaultEventSchedule = await DefaultEventSchedule.query()
      .where("default_event_id", params.default_event_id)
      .fetch();

    const modules = [];

    defaultEventSchedule.toJSON().map((schedule) => {
      modules.push(schedule.module);
    });

    console.log(Math.max.apply(Math, modules));

    return {
      default_event_schedules: defaultEventSchedule,
      max_modules: Math.max.apply(Math, modules),
    };
  }

  /**
   * Render a form to update an existing defaulteventschedule.
   * GET defaulteventschedules/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit({ params, request, response, view }) {}

  /**
   * Update defaulteventschedule details.
   * PUT or PATCH defaulteventschedules/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {}

  /**
   * Delete a defaulteventschedule with id.
   * DELETE defaulteventschedules/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response }) {}
}

module.exports = DefaultEventScheduleController;
