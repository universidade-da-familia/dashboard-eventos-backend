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
      isDynamic: true
    });

    const netsuite_id = data.getValue({ fieldId: "id" })

    if (type === "create") {
      http.post({
        url: "http://apieventos.udf.org.br/entity",
        body: {
          name: data.getValue({ fieldId: "custentity_enl_legalname" }),
          email: data.getValue({ fieldId: "email" }),
          cpf: data.getValue({ fieldId: "custentity_enl_cnpjcpf" }),
          password: "udf123",
          sex: data.getText({ fieldId: "custentity_rsc_sexo" }),
          phone: data.getValue({ fieldId: "phone" }),
          cmn_hierarchy_id: data.getValue({ fieldId: "custentity_cmn_hierarchy_id" }) || "0",
          mu_hierarchy_id: data.getValue({ fieldId: "custentity_mu_hierarchy_id" }) || "0",
          crown_hierarchy_id: data.getValue({ fieldId: "custentity_crown_hierarchy_id" }) || "0",
          mp_hierarchy_id: data.getValue({ fieldId: "custentity_mp_hierarchy_id" }) || "0",
          ffi_hierarchy_id: data.getValue({ fieldId: "custentity_ffi_hierarchy_id" }) || "0",
          gfi_hierarchy_id: data.getValue({ fieldId: "custentity_gfi_hierarchy_id" }) || "0",
          pg_hab_hierarchy_id: data.getValue({ fieldId: "custentity_pg_hab_hierarchy_id" }) || "0",
          pg_yes_hierarchy_id: data.getValue({ fieldId: "custentity_pg_yes_hierarchy_id" }) || "0",
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
          sex: data.getText({ fieldId: "custentity_rsc_sexo" }),
          phone: data.getValue({ fieldId: "phone" }),
          alt_phone: data.getValue({ fieldId: "altphone" }),
          organization_id: data.getValue({ fieldId: "custentity_rsc_igreja" }),
          cmn_hierarchy_id: data.getValue({ fieldId: "custentity_cmn_hierarchy_id" }) || "0",
          mu_hierarchy_id: data.getValue({ fieldId: "custentity_mu_hierarchy_id" }) || "0",
          crown_hierarchy_id: data.getValue({ fieldId: "custentity_crown_hierarchy_id" }) || "0",
          mp_hierarchy_id: data.getValue({ fieldId: "custentity_mp_hierarchy_id" }) || "0",
          ffi_hierarchy_id: data.getValue({ fieldId: "custentity_ffi_hierarchy_id" }) || "0",
          gfi_hierarchy_id: data.getValue({ fieldId: "custentity_gfi_hierarchy_id" }) || "0",
          pg_hab_hierarchy_id: data.getValue({ fieldId: "custentity_pg_hab_hierarchy_id" }) || "0",
          pg_yes_hierarchy_id: data.getValue({ fieldId: "custentity_pg_yes_hierarchy_id" }) || "0",
        }
      });
    }
  }

  return {
    afterSubmit: afterSubmit
  };
});
