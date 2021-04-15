"use strict";

module.exports = {
  /*
  |--------------------------------------------------------------------------
  | Swagger Information
  | Please use Swagger 2 Spesification Docs
  | https://swagger.io/docs/specification/2-0/basic-structure/
  |--------------------------------------------------------------------------
  */

  enable: true,

  options: {
    swaggerDefinition: {
      info: {
        title: "UDF",
        version: "1.0.0",
      },

      // host: "localhost:3333",
      host: "apieventos.udf.org.br",
      basePath: "/",
      schemes: ["http"],

      // Example security definitions.
      securityDefinitions: {
        Bearer: {
          type: "apiKey",
          name: "Authorization",
          in: "header",
        },
      },
    },

    // Path to the API docs
    // Sample usage
    apis: [
      "docs/**/*.yml", // load recursive all .yml file in docs directory
      "docs/**/*.js", // load recursive all .js file in docs directory
    ],
    // apis: ["app/**/*.js", "start/routes.js"],
  },
};
