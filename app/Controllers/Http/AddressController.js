"use strict";

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Database = use("Database");
const Address = use("App/Models/Address");

/**
 * Resourceful controller for interacting with addresses
 */
class AddressController {
  /**
   * Show a list of all addresses.
   * GET addresses
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ request, response, view }) {
    const address = await Address.query()
      .with("entity")
      .fetch();

    return address;
  }

  /**
   * Create/save a new address.
   * POST addresses
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {
    try {
      const { addressesPost, addressesPut } = request.only([
        "addressesPost",
        "addressesPut"
      ]);

      const trx = await Database.beginTransaction();

      if (addressesPost && addressesPost.length > 0) {
        await Address.createMany(addressesPost, trx);
      }

      if (addressesPut && addressesPut.length > 0) {
        addressesPut.map(async address => {
          console.log(address);
          const searchAddress = await Address.findOrFail(address.id);

          searchAddress.merge(address, trx);

          await searchAddress.save();
        });
      }

      trx.commit();

      return response.status(200).send({
        title: "Sucesso!",
        message: "Seus endereços foram atualizados."
      });
    } catch (err) {
      return response.status(err.status).send({
        title: "Falha!",
        message: "Erro ao criar o endereço"
      });
    }
  }

  /**
   * Display a single address.
   * GET addresses/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, response }) {
    try {
      const address = await Address.findOrFail(params.id);

      await address.loadMany(["entity", "organization"]);

      return address;
    } catch (err) {
      return response.status(err.status).send({
        error: {
          title: "Falha!",
          message: "Erro ao mostrar o endereço"
        }
      });
    }
  }

  /**
   * Update address details.
   * PUT or PATCH addresses/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {
    try {
      const {
        entity_id,
        organization_id,
        type,
        cep,
        city,
        uf,
        country,
        street,
        street_number,
        neighborhood,
        complement,
        receiver
      } = request.only([
        "entity_id",
        "organization_id",
        "type",
        "cep",
        "city",
        "uf",
        "country",
        "street",
        "street_number",
        "neighborhood",
        "complement",
        "receiver"
      ]);

      const address = await Address.findOrFail(params.id);

      address.entity_id = entity_id || address.entity_id;
      address.organization_id = organization_id || address.organization_id;
      address.type = type || address.type;
      address.cep = cep || address.cep;
      address.city = city || address.city;
      address.uf = uf || address.uf;
      address.country = country || address.country;
      address.street = street || address.street;
      address.street_number = street_number || address.street_number;
      address.neighborhood = neighborhood || address.neighborhood;
      address.complement = complement || address.complement;
      address.receiver = receiver || address.receiver;

      await address.save();

      return address;
    } catch (err) {
      return response.status(err.status).send({
        error: {
          title: "Falha!",
          message: "Erro ao atualizar o endereço"
        }
      });
    }
  }

  /**
   * Delete a address with id.
   * DELETE addresses/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, response }) {
    try {
      const address = await Address.findOrFail(params.id);

      await address.delete();

      return response.status(200).send({
        title: "Sucesso!",
        message: "O endereço foi removido."
      });
    } catch (err) {
      return response.status(err.status).send({
        error: {
          title: "Falha!",
          message: "Erro ao deletar o endereço"
        }
      });
    }
  }
}

module.exports = AddressController;
