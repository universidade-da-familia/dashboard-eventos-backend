/* eslint-disable */
/**
 * @NApiVersion 2.x
 * @NModuleScope SameAccount
 * @NScriptType UserEventScript
 */
define(["N/runtime", "N/record", "N/http"], function(runtime, record, http) {
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

    const data = record.load({
      type: newRecord.type,
      id: newRecord.id,
      isDynamic: false
    });

    const netsuite_id = data.getValue({ fieldId: "internalid" })

    if (type === "create") {
      http.post({
        url: "http://apieventos.udf.org.br/entity",
        body: {
          name: data.getValue({ fieldId: "custentity_enl_legalname" }),
          email: data.getValue({ fieldId: "email" }),
          cpf: data.getValue({ fieldId: "custentity_enl_cnpjcpf" }),
          password: "udf123",
          birthday: data.getValue({ fieldId: "custentity_rsc_dtnascimento" }),
          sex: data.getText({ fieldId: "custentity_rsc_sexo" }),
          phone: data.getValue({ fieldId: "phone" }),
          user_legacy: true
        }
      });
    }

    if(type === "edit") {
      http.put({
        url: "http://apieventos.udf.org.br/netsuite_entity/" + netsuite_id,
        body: {
          name: data.getValue({ fieldId: "custentity_enl_legalname" }),
          email: data.getValue({ fieldId: "email" }),
          cpf: data.getValue({ fieldId: "custentity_enl_cnpjcpf" }),
          birthday: data.getValue({ fieldId: "custentity_rsc_dtnascimento" }),
          sex: data.getText({ fieldId: "custentity_rsc_sexo" }),
          phone: data.getValue({ fieldId: "phone" }),
          alt_phone: data.getValue({ fieldId: "altphone" }),
          organization_id: data.getValue({ fieldId: "custentity_rsc_igreja" }),
          afl_id: data.getValue({ fieldId: "custentity_udf_cdentidade" }),
          user_legacy: true
        }
      });
    }
  }

  return {
    afterSubmit: afterSubmit
  };
});
