"use strict";

const Mail = use("Mail");

const InviteHook = (exports = module.exports = {});

InviteHook.sendNewInviteMail = async inviteInstance => {
  if (!inviteInstance.email && !inviteInstance.dirty.email) return;

  const { id, event_id, event_type, firstname, email } = inviteInstance;

  await Mail.send(
    ["emails.event_invite", "emails.event_invite-text"],
    {
      email,
      firstname,
      redirect_url: `http://172.16.3.26:3000/evento/${event_id}/checkout/convite/${id}`,
      event_type
    },
    message => {
      message
        .to(email)
        .from("naoresponda@udf.org.br", "no-reply | Dashboard UDF")
        .subject("Convite para evento");
    }
  );
};
