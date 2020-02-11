'use strict'

const Route = use('Route')

Route.post('payment_confirmation', 'OrderTransactionController.update')

Route.post('generate_lesson_reports', 'GenerateLessonReportController.store')

// Logando usuario
Route.post('sessions', 'SessionController.store')
Route.post('organization_sessions', 'SessionController.store_org')
Route.get('sessions/:type', 'SessionController.show')
Route.get('expired_titles/:cpf', 'SessionController.expired_titles')

// CRUD usuário
Route.resource('entity', 'EntityController').except([
  'edit',
  'create',
  'store',
  'update_netsuite'
])
Route.post('entity', 'EntityController.store').validator('Entity')
Route.put('netsuite_entity/:netsuite_id', 'EntityController.update_netsuite')

Route.put('entity_hierarchy/:event_id', 'EntityHierarchyController.update')

// CRUD familia
Route.resource('family', 'FamilyController')

// CRUD ministério
Route.resource('ministery', 'MinisteryController').except(['edit', 'create'])

// CRUD hierarquias
Route.resource('hierarchy', 'HierarchyController').except(['edit', 'create'])

// CRUD ministério
Route.resource('kit', 'KitController').except(['edit', 'create'])

Route.get('layout_certificates', 'LayoutCertificateController.index')
Route.post('layout_certificate', 'LayoutCertificateController.store').validator(
  'LayoutCertificate'
)
Route.get('layout_certificate/:id', 'LayoutCertificateController.show')
Route.put(
  'layout_certificate/:id',
  'LayoutCertificateController.update'
).validator('LayoutCertificate')
Route.delete('layout_certificate/:id', 'LayoutCertificateController.destroy')

// CRUD kits
Route.resource('kit', 'KitController').except(['edit', 'create'])

// CRUD products
Route.resource('product', 'ProductController').except(['edit', 'create'])

// CRUD default event
Route.resource('default_event', 'DefaultEventController').except([
  'organizator_events',
  'edit',
  'create'
])
Route.post('organizator_events', 'DefaultEventController.organizator_events')

// CRUD lesson
Route.resource('lesson', 'LessonController').except(['edit', 'create'])

// CRUD lesson report
Route.get('lesson_reports/:event_id', 'LessonReportController.index')
Route.put('lesson_report/:id', 'LessonReportController.update')
Route.get('lesson_report/:id', 'LessonReportController.show')

// CRUD programation
Route.resource('programation', 'ProgramationController').except([
  'edit',
  'create'
])

// CRUD event
Route.resource('event', 'EventController').except(['edit', 'create'])
Route.post('event_paginate', 'EventController.indexPaginate')
Route.post(
  'event_for_print_certificate',
  'EventController.waitingForAdminPrintCertificates'
)

// CRUD Organization
Route.resource('organization', 'OrganizationController').except([
  'show',
  'edit',
  'create'
])
Route.get('organization/:id', 'OrganizationController.show')

// CRUD invite
Route.resource('invite', 'InviteController').except([
  'index',
  'show',
  'edit',
  'create'
])
Route.get('invites/:id', 'InviteController.index')

// CRUD organizators
Route.resource('event_organizator', 'EventOrganizatorController').except([
  'index',
  'show',
  'delete',
  'edit',
  'create'
])
Route.get('event_organizators/:event_id', 'EventOrganizatorController.index')
Route.get(
  'event_organizator/:organizator_type/:cpf/:default_event_id',
  'EventOrganizatorController.show'
)
Route.delete(
  'event_organizator/:entity_id/event/:event_id',
  'EventOrganizatorController.destroy'
)

// CRUD participants
Route.resource('event_participant', 'EventParticipantController').except([
  'index',
  'show',
  'edit',
  'create',
  'destroy'
])
Route.get('event_participants/:event_id', 'EventParticipantController.index')
Route.get(
  'event_participant/:cpf/:default_event_id',
  'EventParticipantController.show'
)
Route.delete('event_participant/:entity_id/:participant_id', 'EventParticipantController.destroy')

// CRUD entity organizators
Route.resource('entity_organizator', 'EntityOrganizatorController').except([
  'edit',
  'create'
])

// CRUD entity participants
Route.resource('entity_participant', 'EntityParticipantController').except([
  'store',
  'edit',
  'create'
])
Route.post('entity_participant/:event_id', 'EntityParticipantController.store')

// CRUD responsible organization on event
Route.resource('event_organization', 'EventOrganizationController').except([
  'show',
  'store',
  'edit',
  'create'
])
Route.get('event_organizations/:cnpj', 'EventOrganizationController.show')
Route.post('event_organization/:event_id', 'EventOrganizationController.store')

// Solicitando e resetando a senha PF
Route.post('forgot_password', 'ForgotPasswordController.store')
Route.put('forgot_password', 'ForgotPasswordController.update')
// Solicitando e resetando a senha PJ
Route.post('forgot_password_pj', 'ForgotPasswordPjController.store')
Route.put('forgot_password_pj', 'ForgotPasswordPjController.update')

Route.post('files/:user_id/:type', 'FileController.store')
Route.get('files/:id', 'FileController.show')
Route.delete('files/:id', 'FileController.destroy')

Route.get('site_event/:id', 'SiteEventController.show')

Route.resource('address', 'AddressController').except(['edit', 'create', 'destroy'])
Route.delete('address/:id/:index/:netsuite_id', 'AddressController.destroy')

Route.resource('category', 'CategoryController').except(['edit', 'create'])

Route.resource('status', 'StatusController').except(['edit', 'create'])

Route.resource('coupon', 'CouponController').except(['edit', 'create'])

Route.resource('order', 'OrderController').except(['edit', 'create'])

Route.group(() => {
  // Busca o Líder solicitado pelo CPF
  Route.get('leader/:cpf', 'LeaderController.show')

  // Busca a igreja pela parte do nome, uf e cidade
  Route.get('churchs/:uf/:city/:name', 'ChurchController.show')

  // Busca evento/eventos
  // Route.get("events/:id", "EventController.index");
  // Route.get("event/:id", "EventController.show");

  // Envia email para convidar participante para evento
  // Route.post("event_invite", "InviteController.store");
  // Route.get("event_invite/:id", "InviteController.index");

  // Busca Lição
  Route.get('lesson/:id', 'LessonController.show')
}).middleware(['auth'])
