"use strict";

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Database = use("Database");
const Event = use("App/Models/Event");

/**
 * Resourceful controller for interacting with events
 */
class EventController {
  /**
   * Show a list of all events.
   * GET events
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index() {
    const events = await Event.query()
      .with("defaultEvent")
      .with("defaultEvent.ministery")
      .with("organizators")
      .with("participants")
      .with("noQuitterParticipants")
      .orderBy("id")
      .fetch();

    return events;
  }

  /**
   * Show a list of all events.
   * GET events
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async indexPaginate({ request }) {
    const { page } = request.get();

    const events = await Event.query()
      .with("defaultEvent")
      .with("defaultEvent.ministery")
      .with("organizators")
      .with("participants")
      .with("noQuitterParticipants")
      .orderBy("id")
      .paginate(page, 10);

    return events;
  }

  /**
   * Create/save a new event.
   * POST events
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {
    try {
      const data = request.all();

      const trx = await Database.beginTransaction();

      const event = await Event.create(data, trx);

      await event.load("defaultEvent.lessons");

      const lessons = event.toJSON().defaultEvent.lessons.map(lesson => {
        return {
          event_id: event.id,
          lesson_id: lesson.id,
          offer: 0,
          date: null,
          testimony: null,
          doubts: null,
          is_finished: false
        };
      });

      await event.lessonReports().createMany(lessons, trx);

      await trx.commit();

      await event.load("lessonReports");

      return event;
    } catch (err) {
      return response.status(err.status).send({
        error: {
          title: "Falha!",
          message: "Erro ao criar o evento"
        }
      });
    }
  }

  /**
   * Display a single event.
   * GET events/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, response }) {
    try {
      const event = await Event.findOrFail(params.id);

      await event.loadMany([
        "defaultEvent.ministery",
        "defaultEvent.kit.products",
        "defaultEvent.layoutCertificate",
        "defaultEvent.lessons",
        "organization",
        "organizators.file",
        "noQuitterParticipants",
        "participants.file",
        "invites",
        "lessonReports.attendances",
        "lessonReports.lesson"
      ]);

      return event;
    } catch (err) {
      return response.status(err.status).send({
        error: {
          title: "Falha!",
          message: "Erro ao mostrar o evento"
        }
      });
    }
  }

  /**
   * Update event details.
   * PUT or PATCH events/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {
    try {
      const data = request.all();

      const event = await Event.findOrFail(params.id);

      event.merge(data);

      await event.save();

      return event;
    } catch (err) {
      return response.status(err.status).send({
        error: {
          title: "Falha!",
          message: "Erro ao atualizar o evento"
        }
      });
    }
  }

  /**
   * Delete a event with id.
   * DELETE events/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, response }) {
    try {
      const event = await Event.findOrFail(params.id);

      await event.delete();

      return response.status(200).send({
        title: "Sucesso!",
        message: "O evento foi removido."
      });
    } catch (err) {
      return response.status(err.status).send({
        error: {
          title: "Falha!",
          message: "Erro ao deletar o evento"
        }
      });
    }
  }
}

module.exports = EventController;
