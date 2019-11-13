"use strict";

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Event = use("App/Models/Event");
const Entity = use("App/Models/Entity");
const DefaultEvent = use("App/Models/DefaultEvent");
const Participant = use("App/Models/Participant");
/**
 * Resourceful controller for interacting with participants
 */
class EventParticipantController {
  /**
   * Show a list of all participants.
   * GET participants
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ params }) {
    const event = await Event.findOrFail(params.event_id);
    const participants = event.participants().fetch();

    return participants;
  }

  /**
   * Create/save a new participant.
   * POST participants
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {
    const { event_id, entity_id, assistant } = request.only([
      "event_id",
      "entity_id",
      "assistant"
    ]);

    const event = await Event.findOrFail(event_id);
    const entity = await Entity.findOrFail(entity_id);

    await entity.load("organizators");
    await entity.load("participants");

    const event_organizator = entity
      .toJSON()
      .organizators.find(organizator => organizator.id === parseInt(event_id));

    const event_participant = entity
      .toJSON()
      .participants.find(participant => participant.id === parseInt(event_id));

    if (event_organizator === undefined) {
      if (event_participant !== undefined) {
        if (!event_participant.pivot.assistant && assistant) {
          await event.participants().detach([entity_id]);

          event.participants_count = event.participants_count - 1;

          await event.participants().attach([entity_id], row => {
            row.assistant = assistant;
          });
        } else if (event_participant.pivot.assistant && assistant) {
          return response.status(200).send({
            error: {
              title: "Aviso!",
              message: "O CPF informado já é de um líder em treinamento"
            }
          });
        } else if (!event_participant.pivot.assistant && !assistant) {
          return response.status(200).send({
            error: {
              title: "Aviso!",
              message: "O cpf informado já é um participante"
            }
          });
        } else if (event_participant.pivot.assistant && !assistant) {
          await event.participants().detach([entity_id]);

          await event.participants().attach([entity_id], row => {
            row.assistant = assistant;
          });
        }
      } else {
        await event.participants().attach([entity_id], row => {
          row.assistant = assistant;
        });
      }

      await event.participants().fetch();

      if (!assistant) {
        event.participants_count = event.participants_count + 1;
      }

      await event.save();
    } else {
      return response.status(200).send({
        error: {
          title: "Falha!",
          message: "O CPF informado é de um organizador."
        }
      });
    }

    return event;
  }

  /**
   * Display a single participant.
   * GET participants/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, request, response, view }) {
    try {
      const defaultEvent = await DefaultEvent.findOrFail(
        params.default_event_id
      );

      const ministery_id = defaultEvent.ministery_id;
      const participant_hierarchy_id = defaultEvent.participant_hierarchy_id;
      const assistant_hierarchy_id = defaultEvent.assistant_hierarchy_id;
      const sex_type = defaultEvent.sex_type;

      const participant = await Entity.findByOrFail("cpf", params.cpf);

      await participant.load("file");

      if (participant.sex === sex_type || sex_type === "A") {
        if (ministery_id === 1) {
          if (participant.cmn_hierarchy_id >= participant_hierarchy_id) {
            return participant;
          } else {
            return response.status(200).send({
              error: {
                title: "Aviso!",
                message: "CPF Informado não é de um participante válido"
              }
            });
          }
        }
        if (ministery_id === 2) {
          if (participant.mu_hierarchy_id >= participant_hierarchy_id) {
            return participant;
          } else {
            return response.status(200).send({
              error: {
                title: "Aviso!",
                message: "CPF Informado não é de um participante válido"
              }
            });
          }
        }
      } else {
        if (sex_type === "M") {
          return response.status(200).send({
            error: {
              title: "Aviso!",
              message: "Evento exclusivo para o sexo masculino."
            }
          });
        } else {
          return response.status(200).send({
            error: {
              title: "Aviso!",
              message: "Evento exclusivo para o sexo feminino."
            }
          });
        }
      }
    } catch (err) {
      return response.status(err.status).send({
        error: {
          title: "Falha!",
          message: "Nenhum participante foi encontrado com este cpf"
        }
      });
    }
  }

  /**
   * Update participant details.
   * PUT or PATCH participants/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {
    try {
      const { is_quitter } = request.only(["is_quitter"]);

      const participant = await Participant.findOrFail(params.id);
      const event = await Event.findOrFail(participant.event_id);

      if (is_quitter) {
        event.participants_count = event.participants_count - 1;
        await event.save();
      }

      if (!is_quitter) {
        event.participants_count = event.participants_count + 1;
        await event.save();
      }

      participant.is_quitter = is_quitter;

      await participant.save();

      return participant;
    } catch (err) {
      return response.status(err.status).send({
        error: {
          title: "Falha!",
          message: "Erro ao atualizar o participante"
        }
      });
    }
  }

  /**
   * Delete a participant with id.
   * DELETE participants/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, response }) {
    try {
      const participant = await Participant.findOrFail(params.id);
      const event = await Event.findOrFail(participant.event_id);

      await event.participants().detach([participant.entity_id]);

      if (!participant.assistant && !participant.is_quitter) {
        event.participants_count = event.participants_count - 1;
      }

      await event.participants().fetch();

      await event.save();

      return response.status(200).send({
        title: "Sucesso!",
        message: "O participante foi removido do evento."
      });
    } catch (err) {
      return response.status(err.status).send({
        error: {
          title: "Falha!",
          message: "Erro ao excluir o participante no evento"
        }
      });
    }
  }
}

module.exports = EventParticipantController;
