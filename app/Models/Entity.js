'use strict'

const Model = use('Model')
const Hash = use('Hash')

const axios = require('axios')

const api = axios.default.create({
  baseURL: 'https://5260046.restlets.api.netsuite.com/app/site/hosting',
  headers: {
    'Content-Type': 'application/json',
    Authorization:
      'NLAuth nlauth_account=5260046, nlauth_email=lucas.alves@udf.org.br, nlauth_signature=0rZFiwRE!!@@##,nlauth_role=1077'
  }
})

const moment = require('moment')

class Entity extends Model {
  static boot () {
    super.boot()

    this.addHook('beforeSave', async entityInstance => {
      if (entityInstance.dirty.password) {
        entityInstance.password = await Hash.make(entityInstance.password)
      }
    })

    this.addHook('beforeCreate', async entityInstance => {
      const { id, name, email, cpf } = entityInstance

      const fullname = name.split(' ')
      const firstname = fullname[0]
      fullname.shift()
      const lastname = fullname.length >= 1 ? fullname.join(' ') : ''

      const response = await api.post('/restlet.nl?script=162&deploy=1', {
        is_business: false,
        id,
        name,
        firstname,
        lastname,
        email,
        cpf_cnpj: cpf
      })

      entityInstance.netsuite_id =
        response.data.id || entityInstance.netsuite_id
    })

    this.addHook('beforeUpdate', async entityInstance => {
      const {
        id,
        netsuite_id,
        personal_state_id,
        name,
        email,
        cpf,
        sex,
        phone,
        alt_phone,
        cmn_hierarchy_id,
        mu_hierarchy_id,
        crown_hierarchy_id,
        mp_hierarchy_id,
        ffi_hierarchy_id,
        gfi_hierarchy_id,
        pg_hab_hierarchy_id,
        pg_yes_hierarchy_id
      } = entityInstance

      const fullname = name.split(' ')
      const firstname = fullname[0]
      fullname.shift()
      const lastname = fullname.length >= 1 ? fullname.join(' ') : ''

      await api.put('/restlet.nl?script=182&deploy=1', {
        is_business: false,
        id,
        netsuite_id,
        personal_state_id,
        name,
        firstname,
        lastname,
        email,
        cpf_cnpj: cpf,
        sex,
        phone,
        alt_phone,
        cmn_hierarchy_id,
        mu_hierarchy_id,
        crown_hierarchy_id,
        mp_hierarchy_id,
        ffi_hierarchy_id,
        gfi_hierarchy_id,
        pg_hab_hierarchy_id,
        pg_yes_hierarchy_id
      })
    })
  }

  static get computed () {
    return ['age']
  }

  getAge ({ birthday }) {
    const age = moment().diff(moment(birthday), 'years', false)

    return age
  }

  tokens () {
    return this.hasMany('App/Models/Token')
  }

  file () {
    return this.belongsTo('App/Models/File')
  }

  addresses () {
    return this.hasMany('App/Models/Address').orderBy('id')
  }

  creditCards () {
    return this.hasMany('App/Models/CreditCard')
  }

  checkouts () {
    return this.hasMany('App/Models/Checkout')
  }

  checkoutItems () {
    return this.hasMany('App/Models/CheckoutItem')
  }

  families () {
    return this.belongsToMany('App/Models/Family')
      .pivotTable('entity_families')
      .withPivot(['relationship'])
      .withTimestamps()
  }

  entityOrganizations () {
    return this.belongsToMany('App/Models/Organization')
      .pivotTable('entity_organizations')
      .withPivot(['role', 'can_checkout'])
      .withTimestamps()
  }

  church () {
    return this.belongsTo('App/Models/Organization')
  }

  organizators () {
    return this.belongsToMany('App/Models/Event')
      .pivotTable('organizators')
      .withTimestamps()
  }

  noQuitterParticipants () {
    return this.belongsToMany('App/Models/Event')
      .pivotTable('participants')
      .withPivot([
        'id',
        'assistant',
        'attendance_status',
        'is_quitter',
        'event_authorization'
      ])
      .withTimestamps()
      .where('is_quitter', false)
      .andWhere('assistant', false)
  }

  participants () {
    return this.belongsToMany('App/Models/Event')
      .pivotTable('participants')
      .withPivot([
        'id',
        'assistant',
        'attendance_status',
        'is_quitter',
        'event_authorization'
      ])
      .withTimestamps()
  }

  adminPrints () {
    return this.hasMany('App/Models/Event', 'id', 'admin_print_id')
  }

  orders () {
    return this.hasMany('App/Models/Order').orderBy('created_at', 'desc')
  }

  relationships () {
    return this.hasMany('App/Models/Relationship')
  }

  static updateHierarchy (ids, hierarchyName, hierarchyWillBecome) {
    const entities = this.query()
      .whereIn('id', ids).andWhere(hierarchyName, '<', hierarchyWillBecome)
      .update({ [hierarchyName]: hierarchyWillBecome })

    return entities
  }
}

module.exports = Entity
