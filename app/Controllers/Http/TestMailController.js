'use strict'

const Kue = use('Kue')
const Job = use('App/Jobs/TestMail')

class TestMailController {
  /**
   * Create/save a new status.
   * POST status
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store () {
    try {
      const test = 'Teste de envio com redis'

      Kue.dispatch(Job.key, { test }, { attempts: 3 })

      return {
        message: 'Email enviado com sucesso.'
      }
    } catch (err) {
      return err
    }
  }
}

module.exports = TestMailController
