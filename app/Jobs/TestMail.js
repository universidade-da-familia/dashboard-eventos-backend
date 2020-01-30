'use strict'

const Mail = use('Mail')

class TestMail {
  static get concurrency () {
    return 1
  }

  static get key () {
    return 'TestMail-job'
  }

  async handle ({ test }) {
    console.log(`Job: ${TestMail.key}`)

    await Mail.send(
      ['emails.test'],
      { test },
      message => {
        message
          .to('lucas.alves@udf.org.br')
          .from('dev@udf.org.br', 'Portal Líder | Teste')
          .subject('Teste de email com redis')
      }
    )
  }
}

module.exports = TestMail
