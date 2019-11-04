"use strict";

const Entity = use("App/Models/Entity");
const Organization = use("App/Models/Organization");

const ValidateEmail = use("App/Controllers/Http/Validations/ValidateEmail");

/**
 * Resourceful controller for interacting with sessions
 */
class SessionController {
  /**
   * Create/save a new session.
   * POST sessions
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response, auth }) {
    try {
      const { email_cpf_cnpj, password } = request.all();

      const validateEmail = new ValidateEmail();
      const isEmail = await validateEmail.validate(email_cpf_cnpj);

      const user = isEmail
        ? await Entity.findByOrFail("email", email_cpf_cnpj)
        : await Entity.findByOrFail("cpf", email_cpf_cnpj);

      if (user.user_legacy === true) {
        return {
          expired: {
            title: "Senha expirada!",
            message: "Atualize a sua senha de acesso."
          }
        };
      }

      if (
        user.cmn_hierarchy_id < 2 &&
        user.mu_hierarchy_id < 2 &&
        user.crown_hierarchy_id < 2 &&
        user.mp_hierarchy_id < 2 &&
        user.ffi_hierarchy_id < 2 &&
        user.gfi_hierarchy_id < 2 &&
        user.pg_hierarchy_id < 2
      ) {
        return response.status(401).send({
          title: "Não permitido!",
          message: "Acesso restrito para igrejas, líderes e assistentes."
        });
      }

      const token = isEmail
        ? await auth
            .authenticator("jwt_entity")
            .attempt(email_cpf_cnpj, password)
        : await auth.authenticator("jwt_cpf").attempt(email_cpf_cnpj, password);

      return {
        user_type: "entity",
        token,
        user
      };
    } catch (err) {
      return response.status(err.status).send({
        title: "Falha!",
        message: "Usuário ou senha inválidos."
      });
    }
  }

  async store_org({ request, response, auth }) {
    try {
      const { email_cpf_cnpj, password, remember } = request.all();

      const validateEmail = new ValidateEmail();
      const isEmail = await validateEmail.validate(email_cpf_cnpj);

      const user = isEmail
        ? await Organization.findByOrFail("email", email_cpf_cnpj)
        : await Organization.findByOrFail("cnpj", email_cpf_cnpj);

      const token = isEmail
        ? await auth
            .authenticator("jwt_organization")
            .attempt(email_cpf_cnpj, password)
        : await auth
            .authenticator("jwt_cnpj")
            .attempt(email_cpf_cnpj, password);

      return {
        user_type: "organization",
        token,
        user
      };
    } catch (err) {
      return response.status(err.status).send({
        title: "Falha!",
        message: "Usuário ou senha inválidos."
      });
    }
  }

  async show({ params, auth }) {
    const user = await auth
      .authenticator(`${params.type === "entity" ? "jwt" : "jwt_organization"}`)
      .getUser();

    params.type === "entity"
      ? await user.loadMany([
          "file",
          "addresses",
          "creditCards",
          "checkouts",
          "checkoutItems",
          "families",
          "entityOrganizations",
          "organizators",
          "participants",
          "orders.status"
        ])
      : await user.loadMany([
          "file",
          "addresses",
          "creditCards",
          "checkouts",
          "entityOrganizations",
          "events",
          "orders.status"
        ]);

    return user;
  }
}

module.exports = SessionController;
