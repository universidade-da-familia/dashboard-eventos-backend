/* eslint-disable */
/**
 *@author Lucas Alves
 *
 *@NApiVersion 2.x
 *@NScriptType Restlet
 */
define(["N/search"], function (search) {
  /**
   * POST.
   *
   * @param context
   */
  function index(context) {
    return search
      .create({
        type: "invoice",
        filters: [
          ["type", "anyof", "custinvc"],
          "AND",
          ["duedate", "before", "today"],
          "AND",
          ["amountremainingtotalbox", "greaterthan", "0.00"],
          "AND",
          ["status", "is", "Em aberto"],
          "AND",
          ["customer.custentity_enl_cnpjcpf", "is", context.cpf],
        ],
        columns: [
          "trandate",
          "duedate",
          "type",
          "tranid",
          "entity",
          "account",
          "memo",
          "amount",
          search.createColumn({
            name: "custentity_enl_cnpjcpf",
            join: "customer",
          }),
        ],
      })
      .run()
      .getRange({
        start: 0,
        end: 1000,
      })
      .map(function (result) {
        const cpf = result.getValue({
          name: "custentity_enl_cnpjcpf",
          join: "customer",
        });

        return cpf;
      });
  }

  return {
    get: index,
  };
});
