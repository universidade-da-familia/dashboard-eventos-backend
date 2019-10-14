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
      const { email_cpf_cnpj, password, remember } = request.all();

      const validateEmail = new ValidateEmail();
      const isEmail = await validateEmail.validate(email_cpf_cnpj);

      const user = isEmail
        ? await Entity.findByOrFail("email", email_cpf_cnpj)
        : await Entity.findByOrFail("cpf", email_cpf_cnpj);

      if (user.user_legacy === true) {
        return {
          error: {
            title: "Senha expirada!",
            message: "Atualize a sua senha de acesso."
          }
        };
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
        error: {
          title: "Falha!",
          message: "Usuário ou senha inválidos"
        }
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

      if (user.user_legacy === true) {
        return {
          error: {
            title: "Senha expirada!",
            message: "Atualize a sua senha de acesso."
          }
        };
      }

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
        error: {
          title: "Falha!",
          message: "Usuário ou senha inválidos"
        }
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
          "participants"
        ])
      : await user.loadMany([
          "file",
          "addresses",
          "creditCards",
          "checkouts",
          "entityOrganizations",
          "events"
        ]);

    return user;
  }
}

module.exports = SessionController;
