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
   * Show a list of all events.
   * GET events
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async indexPaginate ({ request }) {
    const { page, filterData } = request.only(['page', 'filterData'])

    const { perPage } = filterData

    const entities = await Entity.query()
      .with('addresses')
      .with('orders')
      .with('organizators.defaultEvent.ministery')
      .with('participants.defaultEvent.ministery')
      .where(function () {
        const currentDate = new Date()
        const [start_date] = filterData.start_date.split('T')
        const [end_date] = filterData.end_date.split('T')
        const [ministery_name, ministery_id] = filterData.ministery.split('/')

        if (filterData.id !== '') {
          this.where('id', filterData.id)
        }
        if (filterData.cpf !== '') {
          this.where('cpf', filterData.cpf)
        }
        if (filterData.email !== '') {
          this.where('email', filterData.email)
        }

        // busca dados endereço entidade
        if (filterData.cep !== '') {
          this.whereHas('addresses', builder => {
            builder.where('cep', filterData.cep)
          })
        }
        if (filterData.uf !== '') {
          this.whereHas('addresses', builder => {
            builder.where('uf', filterData.uf)
          })
        }
        if (filterData.city !== '') {
          this.whereHas('addresses', builder => {
            builder.where('city', filterData.city)
          })
        }

        if (filterData.hierarchy !== '0' && filterData.ministery === '') {
          this.where(builder => {
            builder.where('cmn_hierarchy_id', '>=', filterData.hierarchy)
            builder.orWhere('mu_hierarchy_id', '>=', filterData.hierarchy)
            builder.orWhere('crown_hierarchy_id', '>=', filterData.hierarchy)
            builder.orWhere('mp_hierarchy_id', '>=', filterData.hierarchy)
            builder.orWhere('ffi_hierarchy_id', '>=', filterData.hierarchy)
            builder.orWhere('gfi_hierarchy_id', '>=', filterData.hierarchy)
            builder.orWhere('pg_hab_hierarchy_id', '>=', filterData.hierarchy)
            builder.orWhere('pg_yes_hierarchy_id', '>=', filterData.hierarchy)
          })
        }

        if (filterData.hierarchy !== '0' && filterData.ministery !== '') {
          this.where(ministery_name, '>=', filterData.hierarchy)
        }

        if (filterData.only_organizators !== '') {
          this.whereHas(filterData.only_organizators)

          if (filterData.ministery !== '') {
            this.whereHas(`${filterData.only_organizators}.defaultEvent`, builder => {
              builder.where('ministery_id', ministery_id)
            })
          }
          if (filterData.default_event_id) {
            this.whereHas(filterData.only_organizators, builder => {
              builder.where('default_event_id', filterData.default_event_id)
            })
          }
          if (filterData.status === 'Finalizado') {
            this.whereHas(filterData.only_organizators, builder => {
              builder.where('is_finished', true)
            })
          }
          if (filterData.status === 'Não iniciado') {
            this.whereHas(filterData.only_organizators, builder => {
              builder.where('start_date', '>', currentDate)
              builder.where('is_finished', false)
            })
          }
          if (filterData.status === 'Em andamento') {
            this.whereHas(filterData.only_organizators, builder => {
              builder.where('start_date', '<=', currentDate)
              builder.where('is_finished', false)
            })
          }
          if (start_date) {
            this.whereHas(filterData.only_organizators, builder => {
              builder.where('start_date', '>=', start_date)
            })
          }
          if (end_date) {
            this.whereHas(filterData.only_organizators, builder => {
              builder.where('start_date', '<=', end_date)
            })
          }
        } else {
          if (filterData.status === 'Finalizado') {
            this.where(builder => {
              builder.whereHas('organizators', builder => {
                builder.where('is_finished', true)
              })
              builder.orWhereHas('participants', builder => {
                builder.where('is_finished', true)
              })
            })
          }
          if (filterData.status === 'Não iniciado') {
            this.where(builder => {
              builder.whereHas('organizators', builder => {
                builder.where('start_date', '>', currentDate)
                builder.where('is_finished', false)
              })
              builder.orWhereHas('participants', builder => {
                builder.where('start_date', '>', currentDate)
                builder.where('is_finished', false)
              })
            })
          }
          if (filterData.status === 'Em andamento') {
            this.where(builder => {
              builder.whereHas('organizators', builder => {
                builder.where('start_date', '<=', currentDate)
                builder.where('is_finished', false)
              })
              builder.orWhereHas('participants', builder => {
                builder.where('start_date', '<=', currentDate)
                builder.where('is_finished', false)
              })
            })
          }
          if (start_date) {
            this.where(builder => {
              builder.whereHas('organizators', builder => {
                builder.where('start_date', '>=', start_date)
              })
              builder.orWhereHas('participants', builder => {
                builder.where('start_date', '>=', start_date)
              })
            })
          }
          if (end_date) {
            this.where(builder => {
              builder.whereHas('organizators', builder => {
                builder.where('start_date', '<=', end_date)
              })
              builder.orWhereHas('participants', builder => {
                builder.where('start_date', '<=', end_date)
              })
            })
          }
        }
      })
      .orderBy('id', 'asc')
      .paginate(page, perPage)

    return entities
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
      'relationships.relationshipEntity',
      'addresses',
      'organizators.defaultEvent.ministery',
      'organizators.organization',
      'organizators.noQuitterParticipants',
      'participants.noQuitterParticipants',
      'participants.defaultEvent.ministery',
      'creditCards',
      'orders.status',
      'orders.transaction'
    ])

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
  async showCpf ({ params, response }) {
    try {
      const entity = await Entity.findByOrFail('cpf', params.cpf)

      await entity.loadMany([
        'file',
        'relationships.relationshipEntity',
        'addresses',
        'organizators.defaultEvent.ministery',
        'organizators.organization',
        'organizators.noQuitterParticipants',
        'participants.noQuitterParticipants',
        'participants.defaultEvent.ministery',
        'creditCards',
        'orders.status',
        'orders.transaction'
      ])

      return entity
    } catch (err) {
      return response.status(err.status).send({
        title: 'Falha!',
        message: 'Nenhuma entidade foi encontrada com este CPF',
        type: 'not_found'
      })
    }
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
  async update_netsuite ({ params, request, response }) {
    try {
      const data = request.all()

      data.netsuite_id = params.netsuite_id

      if (data.organization_id) {
        const organization = await Organization.findBy('netsuite_id', data.organization_id)

        if (organization) {
          data.organization_id = organization.id
        } else {
          delete data.organization_id
        }
      }

      console.log('iniciando atualizacao')

      const entity = await Entity.findOrCreate({
        netsuite_id: params.netsuite_id
      }, data)

      entity.merge(data)

      await entity.save()

      console.log('entidade criada ou atualizada com sucesso')

      return entity
    } catch (error) {
      console.log(error)
      return response.status(error.status).send({
        title: 'Falha!',
        message: 'Erro ao criar entidade'
      })
    }
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
