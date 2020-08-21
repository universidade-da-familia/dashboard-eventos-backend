'use strict'

const Env = use('Env')

const Mail = use('Mail')

const InviteHook = (exports = module.exports = {})

InviteHook.sendNewInviteMail = async inviteInstance => {
  if (!inviteInstance.email && !inviteInstance.dirty.email) return

  console.log(inviteInstance.toJSON())

  const { id, event_id, event_type, name, email, is_buyer } = inviteInstance
  const node_env = Env.get('NODE_ENV')

  if (is_buyer === true) {
    await Mail.send(
      ['emails.event_invite', 'emails.event_invite-text'],
      {
        email,
        name,
        redirect_url:
          node_env === 'development'
            ? `http://localhost:3000/evento/${event_id}/convite/${id}/confirmacao-comprador`
            : `https://lider.udf.org.br/evento/${event_id}/convite/${id}/confirmacao-comprador`,
        event_type
      },
      message => {
        message
          .to(email)
          .from('naoresponda@udf.org.br', 'no-reply | Portal do Líder')
          .subject('Convite para evento')
      }
    )
  } else {
    await Mail.send(
      ['emails.event_invite', 'emails.event_invite-text'],
      {
        email,
        name,
        redirect_url:
          node_env === 'development'
            ? `http://localhost:3000/evento/${event_id}/convite/${id}/confirmacao`
            : `https://lider.udf.org.br/evento/${event_id}/convite/${id}/confirmacao`,
        event_type
      },
      message => {
        message
          .to(email)
          .from('naoresponda@udf.org.br', 'no-reply | Portal do Líder')
          .subject('Convite para evento')
      }
    )
  }
}
