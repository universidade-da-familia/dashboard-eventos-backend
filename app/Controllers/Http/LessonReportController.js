"use strict";

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const LessonReport = use("App/Models/LessonReport");
const Entity = use("App/Models/Entity");

/**
 * Resourceful controller for interacting with lessons
 */
class LessonReportController {
  /**
   * Show a list of all lessons.
   * GET lessons
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ params }) {
    const lessonReport = await LessonReport.query()
      .where("event_id", params.event_id)
      .with("lesson")
      .with("event.participants")
      .with("attendances")
      .fetch();

    return lessonReport;
  }

  /**
   * Display a single lesson.
   * GET lessons/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params }) {
    const lessonReport = await LessonReport.findOrFail(params.id);

    await lessonReport.loadMany([
      "event.participants",
      "lesson",
      "attendances"
    ]);

    return lessonReport;
  }

  /**
   * Update lesson details.
   * PUT or PATCH lessons/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {
    try {
      const data = request.all();

      const { participants, offer, date, testimony, doubts } = data;

      const lessonReport = await LessonReport.findOrFail(params.id);

      lessonReport.date = date || lessonReport.date;
      lessonReport.offer = offer;
      lessonReport.testimony = testimony;
      lessonReport.doubts = doubts;
      lessonReport.is_finished = true;

      await lessonReport.save();

      if (participants && participants.length > 0) {
        participants.map(async participant => {
          await lessonReport.attendances().detach([participant.id]);

          await lessonReport.attendances().attach([participant.id], row => {
            row.is_present = participant.is_present;
          });
        });
      }

      return response.status(200).send({
        title: "Sucesso!",
        message: "O relatório foi enviado corretamente."
      });
    } catch (err) {
      return response.status(err.status).send({
        title: "Falha!",
        message: "Erro ao atualizar o relatório."
      });
    }
  }
}

module.exports = LessonReportController;
