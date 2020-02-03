/* eslint-disable */
/**
 *@author Lucas Alves
 *
 *@NApiVersion 2.x
 *@NScriptType Restlet
 */
define(["N/record"], function(record) {
  /**
   * PUT.
   *
   * @param context
   */
  function update(context) {
    try {
      const customer = record.load({
        type: record.Type.CUSTOMER,
        id: context.netsuite_id,
        isDynamic: true
      });

      if (context.is_business) {
        customer.setValue({
          fieldId: "companyname",
          value: context.company_name
        });
        customer.setValue({
          fieldId: "custentity_rsc_nomefantasia",
          value: context.fantasy_name
        });
        customer.setValue({ fieldId: "isperson", value: "F" });
      } else {
        customer.setValue({ fieldId: "firstname", value: context.firstname });
        customer.setValue({ fieldId: "lastname", value: context.lastname });
        customer.setValue({ fieldId: "custentity_enl_ienum", value: "ISENTO" });
      }

      customer.setValue({
        fieldId: "custentity_enl_legalname",
        value: context.name
      });
      customer.setValue({
        fieldId: "custentityid_dashboard_cliente",
        value: context.id
      });
      customer.setValue({
        fieldId: "custentity_enl_cnpjcpf",
        value: context.cpf_cnpj
      });
      customer.setValue({ fieldId: "email", value: context.email });
      customer.setValue({
        fieldId: "custentity_rsc_estadocivil",
        value: context.personal_state_id
      });
      if (context.sex === "F") {
        customer.setValue({ fieldId: "custentity_rsc_sexo", value: "1" });
      }
      if (context.sex === "M") {
        customer.setValue({ fieldId: "custentity_rsc_sexo", value: "2" });
      }
      customer.setValue({ fieldId: "phone", value: context.phone });
      customer.setValue({ fieldId: "altphone", value: context.alt_phone });

      customer.save();

      return {
        title: "Sucesso!",
        message: "O registro foi atualizado."
      };
    } catch (err) {
      return {
        title: "Falha!",
        message: "Houve um erro ao atualizar o registro",
        erro: err
      };
    }
  }

  return {
    put: update
  };
});
