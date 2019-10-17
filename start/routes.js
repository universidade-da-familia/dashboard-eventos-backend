"use strict";

const Route = use("Route");

//Logando usuario
Route.post("sessions", "SessionController.store");
Route.post("organization_sessions", "SessionController.store_org");
Route.get("sessions/:type", "SessionController.show");

//CRUD usuário
Route.post("entity", "EntityController.store").validator("Entity");
Route.get("entity/:id", "EntityController.show");
Route.put("entity/:id", "EntityController.update");
Route.get("entities", "EntityController.index");

//CRUD familia
Route.resource("family", "FamilyController");

//CRUD ministério
Route.get("ministeries", "MinisteryController.index");
Route.post("ministery", "MinisteryController.store").validator("Ministery");
Route.get("ministery/:id", "MinisteryController.show");
Route.put("ministery/:id", "MinisteryController.update").validator("Ministery");
Route.delete("ministery/:id", "MinisteryController.destroy");

//CRUD hierarquias
Route.get("hierarchies", "HierarchyController.index");
Route.get("hierarchy/:id", "HierarchyController.show");
Route.post("hierarchy", "HierarchyController.store").validator("Hierarchy");
Route.put("hierarchy/:id", "HierarchyController.update").validator("Hierarchy");
Route.delete("hierarchy/:id", "HierarchyController.destroy");

//CRUD ministério
Route.get("layout_certificates", "LayoutCertificateController.index");
Route.post("layout_certificate", "LayoutCertificateController.store").validator(
  "LayoutCertificate"
);
Route.get("layout_certificate/:id", "LayoutCertificateController.show");
Route.put(
  "layout_certificate/:id",
  "LayoutCertificateController.update"
).validator("LayoutCertificate");
Route.delete("layout_certificate/:id", "LayoutCertificateController.destroy");

//CRUD kits
Route.get("kits", "KitController.index");
Route.get("kit/:id", "KitController.show");
Route.post("kit", "KitController.store").validator("Kit");
Route.put("kit/:id", "KitController.update").validator("Kit");
Route.delete("kit/:id", "KitController.destroy");

//CRUD products
Route.get("products", "ProductController.index");
Route.get("product/:id", "ProductController.show");
Route.post("product", "ProductController.store").validator("Product");
Route.put("product/:id", "ProductController.update").validator("Product");
Route.delete("product/:id", "ProductController.destroy");

//CRUD default event
Route.post("organizator_events", "DefaultEventController.organizator_events");
Route.get("default_events", "DefaultEventController.index");
Route.get("default_event/:id", "DefaultEventController.show");
Route.post("default_event", "DefaultEventController.store");
Route.put("default_event/:id", "DefaultEventController.update").validator(
  "DefaultEvent"
);
Route.delete("default_event/:id", "DefaultEventController.destroy");

//CRUD lesson
Route.get("lessons", "LessonController.index");
Route.get("lesson/:id", "LessonController.show");
Route.post("lesson", "LessonController.store").validator("Lesson");
Route.put("lesson/:id", "LessonController.update").validator("Lesson");
Route.delete("lesson/:id", "LessonController.destroy");

//CRUD lesson report
Route.get("lesson_reports/:event_id", "LessonReportController.index");
Route.put("lesson_report/:id", "LessonReportController.update");
Route.get("lesson_report/:id", "LessonReportController.show");

//CRUD programation
Route.get("programations", "ProgramationController.index");
Route.get("programation/:id", "ProgramationController.show");
Route.post("programation", "ProgramationController.store").validator(
  "Programation"
);
Route.put("programation/:id", "ProgramationController.update").validator(
  "Programation"
);
Route.delete("programation/:id", "ProgramationController.destroy");

//CRUD event
Route.get("events", "EventController.index");
Route.get("event/:id", "EventController.show");
Route.post("event", "EventController.store").validator("Event");
Route.put("event/:id", "EventController.update").validator("Event");
Route.delete("event/:id", "EventController.destroy");

//CRUD Organization
Route.get("organizations", "OrganizationController.index");
Route.get("organization/:id", "OrganizationController.show");
Route.post("organization", "OrganizationController.store").validator(
  "Organization"
);
Route.put("organization/:id", "OrganizationController.update").validator(
  "Organization"
);
Route.delete("organization/:id", "OrganizationController.destroy");

//CRUD invite
Route.get("invites/:id", "InviteController.index");
Route.get("invite/:id", "InviteController.show");
Route.post("invite", "InviteController.store");
Route.put("invite/:id", "InviteController.update");
Route.delete("invite/:id", "InviteController.destroy");

//CRUD organizators
Route.get("event_organizators/:event_id", "EventOrganizatorController.index");
Route.get(
  "event_organizator/:organizator_type/:cpf/:default_event_id",
  "EventOrganizatorController.show"
);
Route.post("event_organizator", "EventOrganizatorController.store");
Route.put("event_organizator/:id", "EventOrganizatorController.update");
Route.delete(
  "event_organizator/:entity_id/event/:event_id",
  "EventOrganizatorController.destroy"
);

//CRUD participants
Route.get("event_participants/:event_id", "EventParticipantController.index");
Route.get(
  "event_participant/:cpf/:default_event_id",
  "EventParticipantController.show"
);
Route.post("event_participant", "EventParticipantController.store");
Route.put("event_participant/:id", "EventParticipantController.update");
Route.delete("event_participant/:id", "EventParticipantController.destroy");

//CRUD entity organizators
Route.get("entity_organizators", "EntityOrganizatorController.index");
Route.get("entity_organizator/:id", "EntityOrganizatorController.show");
Route.post("entity_organizator", "EntityOrganizatorController.store");
Route.put("entity_organizator/:id", "EntityOrganizatorController.update");
Route.delete("entity_organizator/:id", "EntityOrganizatorController.destroy");

//CRUD entity participants
Route.get("entity_participants", "EntityParticipantController.index");
Route.get("entity_participant/:id", "EntityParticipantController.show");
Route.post("entity_participant/:event_id", "EntityParticipantController.store");
Route.put("entity_participant/:id", "EntityParticipantController.update");
Route.delete("entity_participant/:id", "EntityParticipantController.destroy");

//CRUD responsible organization on event
Route.get("event_organizations", "EventOrganizationController.index");
Route.get("event_organizations/:cnpj", "EventOrganizationController.show");
Route.post("event_organization/:event_id", "EventOrganizationController.store");
Route.put("event_organization/:id", "EventOrganizationController.update");
Route.delete("event_organization/:id", "EventOrganizationController.destroy");

//Solicitando e resetando a senha PF
Route.post("forgot_password", "ForgotPasswordController.store");
Route.put("forgot_password", "ForgotPasswordController.update");
//Solicitando e resetando a senha PJ
Route.post("forgot_password_pj", "ForgotPasswordPjController.store");
Route.put("forgot_password_pj", "ForgotPasswordPjController.update");

Route.post("files/:user_id/:type", "FileController.store");
Route.get("files/:id", "FileController.show");
Route.get("image/:id", "FileController.showImage");

Route.get("site_event/:id", "SiteEventController.show");

Route.resource("address", "AddressController");

Route.group(() => {
  //Busca o Líder solicitado pelo CPF
  Route.get("leader/:cpf", "LeaderController.show");

  //Busca a igreja pela parte do nome, uf e cidade
  Route.get("churchs/:uf/:city/:name", "ChurchController.show");

  //Busca evento/eventos
  //Route.get("events/:id", "EventController.index");
  //Route.get("event/:id", "EventController.show");

  //Envia email para convidar participante para evento
  // Route.post("event_invite", "InviteController.store");
  // Route.get("event_invite/:id", "InviteController.index");

  //Busca Lição
  Route.get("lesson/:id", "LessonController.show");
}).middleware(["auth"]);
