"use strict";

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Database = use("Database");
const BankAccount = use("App/Models/BankAccount");
const Entity = use("App/Models/Entity");
const Event = use("App/Models/Event");
const Log = use("App/Models/Log");
const Participant = use("App/Models/Participant");

const Kue = use("Kue");
const Job = use("App/Jobs/FinishInscriptions");

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
      .orderBy("start_date", "desc")
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
    const { page, filterData } = request.only(["page", "filterData"]);

    const { perPage } = filterData;

    const events = await Event.query()
      .with("defaultEvent.ministery")
      .with("organizators")
      .with("participants")
      .with("noQuitterParticipants")
      .whereHas("organizators", (builder) => {
        if (filterData.cpf) {
          builder.where("cpf", filterData.cpf);
        }
      })
      .whereHas("defaultEvent", (builder) => {
        if (filterData.ministery) {
          builder.where("ministery_id", filterData.ministery);
        }
        if (filterData.default_event_id) {
          builder.where("id", filterData.default_event_id);
        }
        if (filterData.event_type) {
          builder.where("event_type", filterData.event_type);
        }
      })
      .where(function () {
        const currentDate = new Date();
        const [start_date] = filterData.start_date.split("T");
        const [end_date] = filterData.end_date.split("T");

        if (filterData.id) {
          this.where("id", filterData.id);
        }

        if (filterData.status === "Finalizado") {
          this.where("is_finished", true);
        }
        if (filterData.status === "Não iniciado") {
          this.where("start_date", ">", currentDate);
          this.where("is_finished", false);
        }
        if (filterData.status === "Em andamento") {
          this.where("start_date", "<=", currentDate);
          this.where("is_finished", false);
        }
        if (start_date) {
          this.where("start_date", ">=", start_date);
        }
        if (end_date) {
          this.where("start_date", "<=", end_date);
        }

        if (filterData.modality) {
          this.where("modality", filterData.modality);
        }

        // busca dados endereço entidade
        if (filterData.country !== "") {
          this.where(
            "country",
            filterData.country === "30" ? "BRASIL" : filterData.country
          );
        }
        if (filterData.cep !== "") {
          this.where("cep", filterData.cep);
        }
        if (filterData.uf !== "") {
          this.where("uf", filterData.uf);
        }
        if (filterData.apiUf !== "") {
          this.where("uf", filterData.apiUf);
        }
        if (filterData.city !== "") {
          this.where("city", filterData.city);
        }
        if (filterData.apiCity !== "") {
          this.where("city", filterData.apiCity);
        }
        if (filterData.is_printed === "false") {
          this.where((builder) => {
            builder.whereHas("participants", (builder) => {
              builder.whereNull("print_date").andWhere("is_quitter", false);
            });
            builder.andWhere("is_inscription_finished", true);
            builder.andWhere("digital_certificate", false);
          });
        }
        if (filterData.is_printed === "true") {
          this.where((builder) => {
            builder.whereHas("participants", (builder) => {
              builder.whereNotNull("print_date").andWhere("is_quitter", false);
            });
            builder.andWhere("is_inscription_finished", true);
          });
        }
      })
      .orderBy("start_date", "desc")
      .paginate(page, perPage);

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
  async exportExcel({ request }) {
    const { lastPage, filterData } = request.only(["lastPage", "filterData"]);

    const { perPage } = filterData;
    const allData = [];

    for (let index = 1; index <= lastPage; index++) {
      const event = await Event.query()
        .with("defaultEvent.ministery")
        .with("organizators")
        .with("participants")
        .with("noQuitterParticipants")
        .whereHas("organizators", (builder) => {
          if (filterData.cpf) {
            builder.where("cpf", filterData.cpf);
          }
        })
        .whereHas("defaultEvent", (builder) => {
          if (filterData.ministery) {
            builder.where("ministery_id", filterData.ministery);
          }
          if (filterData.default_event_id) {
            builder.where("id", filterData.default_event_id);
          }
        })
        .where(function () {
          const currentDate = new Date();
          const [start_date] = filterData.start_date.split("T");
          const [end_date] = filterData.end_date.split("T");

          if (filterData.id) {
            this.where("id", filterData.id);
          }

          if (filterData.status === "Finalizado") {
            this.where("is_finished", true);
          }
          if (filterData.status === "Não iniciado") {
            this.where("start_date", ">", currentDate);
            this.where("is_finished", false);
          }
          if (filterData.status === "Em andamento") {
            this.where("start_date", "<=", currentDate);
            this.where("is_finished", false);
          }
          if (start_date) {
            this.where("start_date", ">=", start_date);
          }
          if (end_date) {
            this.where("start_date", "<=", end_date);
          }

          // busca dados endereço entidade
          if (filterData.cep !== "") {
            this.where("cep", filterData.cep);
          }
          if (filterData.uf !== "") {
            this.where("uf", filterData.uf);
          }
          if (filterData.city !== "") {
            this.where("city", filterData.city);
          }
          if (filterData.is_printed === "false") {
            this.where((builder) => {
              builder.whereHas("participants", (builder) => {
                builder.whereNull("print_date").andWhere("is_quitter", false);
              });
              builder.andWhere("is_inscription_finished", true);
              builder.andWhere("digital_certificate", false);
            });
          }
          if (filterData.is_printed === "true") {
            this.where((builder) => {
              builder.whereHas("participants", (builder) => {
                builder
                  .whereNotNull("print_date")
                  .andWhere("is_quitter", false);
              });
              builder.andWhere("is_inscription_finished", true);
            });
          }
        })
        .orderBy("start_date", "desc")
        .paginate(index, perPage);

      allData.push(...event.toJSON().data);
    }

    return allData;
  }

  async waitingForAdminPrintCertificates({ request }) {
    const { page, filterPrintData } = request.only(["page", "filterPrintData"]);

    const events = await Event.waitingForAdminPrintCertificates(
      page,
      filterPrintData
    );

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
      let bank_account_data = null;
      const data = request.all();

      console.log("entrei aqui");

      const user_logged_id = parseInt(request.header("user_logged_id"));
      const user_logged_type = request.header("user_logged_type");

      const entity = await Entity.findOrFail(user_logged_id);

      console.log("entidade");

      if (data.bank_account) {
        const { bank_account } = data;

        console.log("entrei conta banco");

        delete data.bank_account;

        if (bank_account.bank_account_id === "other") {
          bank_account_data = await entity.bankAccounts().create({
            entity_id: user_logged_id,
            bank_id: bank_account.bank_id,
            agency: bank_account.agency,
            account_number: bank_account.account_number,
            favored: bank_account.favored,
            account_type: bank_account.account_type,
            favored_type: bank_account.favored_type,
            cpf_cnpj: bank_account.cpf_cnpj,
          });
        } else {
          bank_account_data = await BankAccount.findOrFail(
            bank_account.bank_account_id
          );
        }

        const trx = await Database.beginTransaction();

        console.log("comeco trx");

        const event = await Event.create(data, trx);

        console.log("criei evento");

        await bank_account_data
          .eventBankAccounts()
          .attach([event.id], null, trx);

        console.log("depois attach");

        await trx.commit();

        console.log("depois do trx");

        // await event.load("lessonReports");

        if (user_logged_id && user_logged_type) {
          await Log.create({
            action: "create",
            model: "event",
            model_id: event.id,
            description: `O evento id ${event.id} foi criado.`,
            [`${user_logged_type}_id`]: user_logged_id,
          });
        }

        console.log("print do evento");

        return event;
      } else {
        const trx = await Database.beginTransaction();

        const event = await Event.create(data, trx);

        await event.load("defaultEvent.lessons");

        const lessons = event.toJSON().defaultEvent.lessons.map((lesson) => {
          return {
            event_id: event.id,
            lesson_id: lesson.id,
            offer: 0,
            date: null,
            testimony: null,
            doubts: null,
            is_finished: false,
          };
        });

        await event.lessonReports().createMany(lessons, trx);

        await trx.commit();

        await event.load("lessonReports");

        if (user_logged_id && user_logged_type) {
          await Log.create({
            action: "create",
            model: "event",
            model_id: event.id,
            description: `O evento id ${event.id} foi criado.`,
            [`${user_logged_type}_id`]: user_logged_id,
          });
        }

        return event;
      }
    } catch (err) {
      return response.status(err.status).send({
        error: {
          title: "Falha!",
          message: "Erro ao criar o evento",
        },
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
        "organizators.addresses",
        "noQuitterParticipants",
        "participants.file",
        "invites",
        "lessonReports.attendances",
        "lessonReports.lesson",
        "schedules",
      ]);

      const eventData = event.toJSON();

      const participants = [];

      eventData.participants.map((participant) => {
        participants.push(participant.pivot.id);
      });

      const participantsData = await Participant.query()
        .with("order")
        .where(function () {
          this.whereIn("id", participants);
          this.whereNotNull("order_id");
        })
        .fetch();

      eventData.participants.map((participant, index) => {
        const order_data = participantsData
          .toJSON()
          .find((teste) => teste.entity_id === participant.id);

        eventData.participants[index].participant_order = order_data || null;
      });

      return eventData;
    } catch (err) {
      return response.status(err.status).send({
        error: {
          title: "Falha!",
          message: "Erro ao mostrar o evento",
        },
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

      const user_logged_id = parseInt(request.header("user_logged_id"));
      const user_logged_type = request.header("user_logged_type");

      const event = await Event.findOrFail(params.id);
      await event.loadMany([
        "defaultEvent.ministery",
        "noQuitterParticipants",
        "organizators",
      ]);

      if (user_logged_id && user_logged_type) {
        await Log.create({
          action: "update",
          model: "event",
          model_id: event.id,
          description: `O evento id ${event.id} foi atualizado.`,
          new_data: data,
          [`${user_logged_type}_id`]: user_logged_id,
        });
      }

      event.merge(data);

      await event.save();

      if (data.is_inscription_finished) {
        Kue.dispatch(Job.key, event, { attempts: 5 });
      }

      return event;
    } catch (err) {
      return response.status(err.status).send({
        error: {
          title: "Falha!",
          message: "Erro ao atualizar o evento",
        },
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
  async destroy({ request, params, response }) {
    try {
      const event = await Event.findOrFail(params.id);

      const user_logged_id = parseInt(request.header("user_logged_id"));
      const user_logged_type = request.header("user_logged_type");

      if (user_logged_id && user_logged_type) {
        await Log.create({
          action: "update",
          model: "event",
          model_id: event.id,
          description: `O evento id ${event.id} foi deletado.`,
          [`${user_logged_type}_id`]: user_logged_id,
        });
      }

      await event.delete();

      return response.status(200).send({
        title: "Sucesso!",
        message: "O evento foi removido.",
      });
    } catch (err) {
      return response.status(err.status).send({
        error: {
          title: "Falha!",
          message: "Erro ao deletar o evento",
        },
      });
    }
  }
}

module.exports = EventController;
