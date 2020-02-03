'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Entity = use('App/Models/Entity')
const Organization = use('App/Models/Organization')

const Kue = use('Kue')
const JobCreate = use('App/Jobs/CreateEntity')
const JobUpdate = use('App/Jobs/UpdateEntity')

const Database = use('Database')

class EntityController {
  /**
   * Show a list of all users.
   * GET users
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index () {
    const entity = await Entity.query()
      .with('file')
      .with('families')
      .fetch()

    return entity
  }

  /**
   * Create/save a new user.
   * POST users
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request }) {
    const data = request.all()
    const addresses = request.input('addresses')

    const {
      family_id,
      relationship,
      responsible_organization_id,
      responsible_role
    } = data

    delete data.family_id
    delete data.relationship
    delete data.responsible_organization_id
    delete data.responsible_role

    const trx = await Database.beginTransaction()

    const entity = await Entity.create(data, trx)

    addresses && (await entity.addresses().createMany(addresses, trx))

    family_id &&
      (await entity.families().attach(
        [family_id],
        row => {
          row.relationship = relationship
        },
        trx
      ))

    responsible_organization_id &&
      (await entity.responsibles().attach(
        [responsible_organization_id],
        row => {
          row.responsible_role = responsible_role
        },
        trx
      ))

    await trx.commit()

    Kue.dispatch(JobCreate.key, entity, { attempts: 5 })

    return entity
  }

  /**
   * Display a single user.
   * GET users/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params }) {
    const entity = await Entity.findOrFail(params.id)

    await entity.loadMany([
      'file',
      'families',
      'organizators.defaultEvent.ministery',
      'organizators.organization',
      'organizators.noQuitterParticipants',
      'participants.noQuitterParticipants',
      'participants.defaultEvent.ministery',
      'creditCards',
      'addresses',
      'checkouts',
      'checkoutItems',
      'orders'
    ])

    return entity
  }

  /**
   * Update user details.
   * PUT or PATCH users/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request }) {
    const entity = await Entity.findOrFail(params.id)

    const data = request.all()

    entity.merge(data)

    await entity.save()

    Kue.dispatch(JobUpdate.key, entity, { attempts: 5 })

    return entity
  }

  /**
   * Update user details.
   * PUT or PATCH users/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update_netsuite ({ params, request }) {
    const entity = await Entity.findByOrFail('netsuite_id', params.netsuite_id)

    const data = request.all()

    if (data.organization_id) {
      const organization = await Organization.findBy('netsuite_id', data.organization_id)

      if (organization) {
        data.organization_id = organization.id
      } else {
        delete data.organization_id
      }
    }

    entity.merge(data)

    await entity.save()

    return entity
  }

  /**
   * Delete a user with id.
   * DELETE users/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params }) {
    const entity = await Entity.findOrFail(params.id)

    await entity.delete()
  }
}

module.exports = EntityController
