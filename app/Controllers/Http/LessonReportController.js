"use strict";

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const LessonReport = use("App/Models/LessonReport");

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
  async index({ request, response, view }) {
    const lessonReport = await LessonReport.all();

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
  async show({ params, request, response, view }) {
    const lessonReport = await LessonReport.findOrFail(params.id);

    await lessonReport.loadMany(["lesson", "attendances"]);

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
      const {
        event_id,
        lesson_id,
        offer,
        date,
        testimony,
        doubts,
        is_finished
      } = request.only([
        "event_id",
        "lesson_id",
        "offer",
        "date",
        "testimony",
        "doubts",
        "is_finished"
      ]);

      const lessonReport = await LessonReport.findOrFail(params.id);

      lessonReport.event_id = event_id || lessonReport.event_id;
      lessonReport.lesson_id = lesson_id || lessonReport.lesson_id;
      lessonReport.offer = offer || lessonReport.offer;
      lessonReport.date = date || lessonReport.date;
      lessonReport.testimony = testimony || lessonReport.testimony;
      lessonReport.doubts = doubts || lessonReport.doubts;
      lessonReport.is_finished = is_finished || lessonReport.is_finished;

      await lessonReport.save();

      return lessonReport;
    } catch (err) {
      return response.status(err.status).send({
        error: {
          title: "Falha!",
          message: "Erro ao atualizar o layout do certificado"
        }
      });
    }
  }
}

module.exports = LessonReportController;
