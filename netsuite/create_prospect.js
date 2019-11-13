/**
 *@author Lucas Alves
 *
 *@NApiVersion 2.x
 *@NScriptType Restlet
 */
define(["N/record"], function(record) {
  /**
   * POST.
   *
   * @param context
   */
  function store(context) {
    const customer = record.create({ type: record.Type.PROSPECT });

    if (context.is_business) {
      customer.setValue({
        fieldId: "custentity_enl_legalname",
        value: context.name
      });
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
      customer.setValue({
        fieldId: "custentity_enl_legalname",
        value: context.name
      });
      customer.setValue({ fieldId: "firstname", value: context.firstname });
      customer.setValue({ fieldId: "lastname", value: context.lastname });
      customer.setValue({ fieldId: "isperson", value: "T" });
    }

    customer.setValue({
      fieldId: "custentity_enl_cnpjcpf",
      value: context.cpf_cnpj
    });
    customer.setValue({ fieldId: "email", value: context.email });
    customer.setValue({ fieldId: "subsidiary", value: 2 });
    customer.setValue({
      fieldId: "custrecord_udf_flag_integrado",
      value: true
    });

    const customerId = customer.save();

    return {
      id: customerId
    };
  }

  return {
    post: store
  };
});
