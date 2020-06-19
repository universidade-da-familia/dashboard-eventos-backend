'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Bank extends Model {
  bankAccounts () {
    return this.hasMany('App/Models/BankAccount').orderBy('id')
  }
}

module.exports = Bank
