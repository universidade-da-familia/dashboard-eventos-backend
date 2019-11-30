/**
 * @NApiVersion 2.x
 * @NModuleScope SameAccount
 * @NScriptType UserEventScript
 */
define(["N/runtime", "N/http"], function(runtime, http) {
  /**
   * Function definition to be triggered before record is loaded.
   *
   * @param {Object} scriptContext
   * @param {Record} scriptContext.newRecord - New record
   * @param {Record} scriptContext.oldRecord - Old record
   * @param {string} scriptContext.type - Trigger type
   */
  function afterSubmit(scriptContext) {
    const type = scriptContext.type;
    const newRecord = scriptContext.newRecord;

    if (type === "create" && newRecord.isperson === "T") {
      http.post({
        url: "http://apieventos.udf.org.br/entity",
        body: {
          entity_type: "prospect",
          name: newRecord.getValue({ name: "altname" }),
          email: newRecord.getValue({ name: "email" }),
          cpf: newRecord.getValue({ name: "custentity_enl_cnpjcpf" }),
          password: "udf123",
          birthday: newRecord.getValue({ name: "custentity_rsc_dtnascimento" }),
          sex: newRecord.getValue({ name: "custentity_rsc_sexo" }),
          phone: newRecord.getValue({ name: "phone" }),
          user_legacy: true
        },
        headers: {
          "Content-Type": "application/json"
        }
      });
    }
  }

  return {
    afterSubmit: afterSubmit
  };
});
