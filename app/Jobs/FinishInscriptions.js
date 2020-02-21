'use strict'

const Mail = use('Mail')

class FinishInscriptions {
  // If this getter isn't provided, it will default to 1.
  // Increase this number to increase processing concurrency.
  static get concurrency () {
    return 1
  }

  // This is required. This is a unique key used to identify this job.
  static get key () {
    return 'FinishInscriptions-job'
  }

  // This is where the work is done.
  async handle (data) {
    console.log('FinishInscriptions-job started')

    const { email } = data.defaultEvent.ministery
    const organizator = data.organizators[0]

    await Mail.send(
      ['emails.finish_inscription', 'emails.finish_inscription-text'],
      {
        id: data.id,
        event_name: data.defaultEvent.name,
        participants: data.noQuitterParticipants.length,
        initial_date: data.start_date,
        organizator_name: organizator.name,
        organizator_cpf: organizator.cpf || 'sem CPF'
      },
      message => {
        message
          .to(email)
          .from('naoresponda@udf.org.br', 'no-reply | Portal do Líder')
          .subject(`Inscrição finalizada - evento ${data.id}`)
      }
    )

    console.log('FinishInscriptions-job enviado com sucesso!')
  }
}

module.exports = FinishInscriptions
