"use strict";

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Database = use("Database");
const Schedule = use("App/Models/Schedule");

/**
 * Resourceful controller for interacting with schedules
 */
class ScheduleController {
  /**
   * Show a list of all schedules.
   * GET schedules
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ request, response, view }) {}

  /**
   * Create/save a new schedule.
   * POST schedules
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {
    try {
      const { schedules } = request.only(["schedules"]);

      const trx = await Database.beginTransaction();

      await Schedule.createMany(schedules, trx);

      trx.commit();

      return response.status(200).send({
        title: "Sucesso!",
        message: "Seus cronogramas foram criados com sucesso.",
      });
    } catch (err) {
      return response.status(err.status).send({
        error: {
          title: "Falha!",
          message: "Erro ao criar os cronogramas",
        },
      });
    }
  }

  /**
   * Create/save a new schedule.
   * POST event_schedules
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async event_schedule({ request, response }) {
    try {
      const { schedulesPost, schedulesPut } = request.only([
        "schedulesPost",
        "schedulesPut",
      ]);

      const trx = await Database.beginTransaction();

      if (schedulesPost && schedulesPost.length > 0) {
        await Schedule.createMany(schedulesPost, trx);
      }

      if (schedulesPut && schedulesPut.length > 0) {
        schedulesPut.map(async (schedule) => {
          const searchSchedules = await Schedule.findOrFail(schedule.id);

          searchSchedules.merge(schedule, trx);

          await searchSchedules.save();
        });
      }

      trx.commit();

      // if (user_logged_id && user_logged_type) {
      //   await Log.create({
      //     action: 'create',
      //     model: 'address',
      //     model_id: user.id,
      //     description: `Os endereços de CEP ${ceps.join(', ')} foram criados/atualizados`,
      //     [`${user_logged_type}_id`]: user_logged_id
      //   })
      // }

      return response.status(200).send({
        title: "Sucesso!",
        message: "Cronograma foram atualizados.",
      });
    } catch (err) {
      return response.status(err.status).send({
        title: "Falha!",
        message: "Erro ao atualizar as contas bancárias",
      });
    }
  }

  /**
   * Display a single schedule.
   * GET schedules/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, request, response, view }) {}

  /**
   * Render a form to update an existing schedule.
   * GET schedules/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit({ params, request, response, view }) {}

  /**
   * Update schedule details.
   * PUT or PATCH schedules/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {}

  /**
   * Delete a schedule with id.
   * DELETE schedules/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, response }) {
    try {
      const { id } = params;

      const schedule = await Schedule.findOrFail(id);

      await schedule.delete();

      return response.status(200).send({
        title: "Sucesso!",
        message: "O cronograma foi removido.",
      });
    } catch (err) {
      return response.status(err.status).send({
        error: {
          title: "Falha!",
          message: "Erro ao deletar o cronograma",
        },
      });
    }
  }
}

module.exports = ScheduleController;
