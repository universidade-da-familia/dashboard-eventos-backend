/**
 *@author Lucas Alves
 *
 *@NApiVersion 2.x
 *@NScriptType Restlet
 *@NModuleScope SameAccount
 */
define(["N/record"], function(record) {
  /**
   * POST.
   *
   * @param context
   */
  function store(context) {
    const salesOrder = record.create({
      type: record.Type.SALES_ORDER,
      isDynamic: true,
      defaultValues: {
        entity: context.entity.netsuite_id
      }
    });

    salesOrder.setValue({ fieldId: "trandate", value: new Date() });
    salesOrder.setValue({ fieldId: "department", value: "3" });
    salesOrder.setValue({ fieldId: "class", value: "1" });
    salesOrder.setValue({ fieldId: "location", value: "1" });

    if (context.card === null) {
      salesOrder.setValue({ fieldId: "terms", value: "10" });
    } else {
      if (context.installments === 1) {
        salesOrder.setValue({ fieldId: "terms", value: "1" });
      }

      if (context.installments === 2) {
        salesOrder.setValue({ fieldId: "terms", value: "15" });
      }

      if (context.installments === 3) {
        salesOrder.setValue({ fieldId: "terms", value: "16" });
      }
    }

    salesOrder.setValue({
      fieldId: "custbody_enl_operationtypeid",
      value: "1"
    });
    salesOrder.setValue({
      fieldId: "custbody_enl_order_documenttype",
      value: "1"
    });
    salesOrder.setValue({
      fieldId: "custbodyudf_observacao_cliente",
      value: "Pedido gerado automaticamente através da plataforma de líderes"
    });

    salesOrder.setValue({
      fieldId: "custbody_rsc_payu_order_id",
      value: context.payu_order_id
    });

    salesOrder.setValue({
      fieldId: "custbody_rsc_payu_json",
      value: context.payu_json
    });

    salesOrder.setValue({ fieldId: "custbody_enl_freighttype", value: "1" });

    if (context.shipping_option.delivery_method_name === "Correios PAC") {
      salesOrder.setValue({
        fieldId: "shipmethod",
        value: 3647
      });

      salesOrder.setValue({
        fieldId: "custbody_enl_carrierid",
        value: 4
      });
    } else if (
      context.shipping_option.delivery_method_name === "Correios Sedex"
    ) {
      salesOrder.setValue({
        fieldId: "shipmethod",
        value: 3651
      });

      salesOrder.setValue({
        fieldId: "custbody_enl_carrierid",
        value: 5
      });
    } else if (
      context.shipping_option.delivery_method_name === "Braspress Standard"
    ) {
      salesOrder.setValue({
        fieldId: "shipmethod",
        value: 3653
      });

      salesOrder.setValue({
        fieldId: "custbody_enl_carrierid",
        value: 3
      });
    } else if (
      context.shipping_option.delivery_method_name === "Braspress Multiply"
    ) {
      salesOrder.setValue({
        fieldId: "shipmethod",
        value: 3652
      });

      salesOrder.setValue({
        fieldId: "custbody_enl_carrierid",
        value: 3
      });
    } else if (
      context.shipping_option.delivery_method_name === "Braspress Aéreo"
    ) {
      salesOrder.setValue({
        fieldId: "shipmethod",
        value: 3654
      });

      salesOrder.setValue({
        fieldId: "custbody_enl_carrierid",
        value: 3
      });
    } else if (
      context.shipping_option.delivery_method_name === "Azul Cargo Express"
    ) {
      salesOrder.setValue({
        fieldId: "shipmethod",
        value: 3655
      });

      salesOrder.setValue({
        fieldId: "custbody_enl_carrierid",
        value: 1
      });
    } else if (
      context.shipping_option.delivery_method_name === "Araçalog Aéreo"
    ) {
      salesOrder.setValue({
        fieldId: "shipmethod",
        value: 3656
      });

      salesOrder.setValue({
        fieldId: "custbody_enl_carrierid",
        value: 2
      });
    } else if (
      context.shipping_option.delivery_method_name === "Aracalog Standard"
    ) {
      salesOrder.setValue({
        fieldId: "shipmethod",
        value: 3657
      });

      salesOrder.setValue({
        fieldId: "custbody_enl_carrierid",
        value: 2
      });
    }

    if (context.shipping_cost === 0) {
      salesOrder.setValue({
        fieldId: "custbody_enl_trans_freightamount",
        value: 0
      });

      salesOrder.setValue({
        fieldId: "altshippingcost",
        value: 0
      });

      salesOrder.setValue({
        fieldId: "shippingcost",
        value: 0
      });
    }

    const shippingAddress = salesOrder.getSubrecord({
      fieldId: "shippingaddress"
    });

    shippingAddress.setValue({
      fieldId: "addr1",
      value: context.shipping_street + ", " + context.shipping_street_number
    });
    shippingAddress.setValue({
      fieldId: "city",
      value: context.shipping_city
    });
    shippingAddress.setValue({
      fieldId: "state",
      value: context.shipping_uf
    });
    shippingAddress.setValue({
      fieldId: "zip",
      value: context.shipping_cep
    });
    shippingAddress.setValue({
      fieldId: "addressee",
      value: context.shipping_receiver
    });

    shippingAddress.setValue({
      fieldId: "attention",
      value: context.shipping_receiver
    });

    salesOrder.selectNewLine({ sublistId: "item" });

    const products = context.products;
    products.forEach(function(product) {
      salesOrder.setCurrentSublistValue({
        sublistId: "item",
        fieldId: "item",
        value: product.netsuite_id
      });
      salesOrder.setCurrentSublistValue({
        sublistId: "item",
        fieldId: "quantity",
        value: product.quantity
      });
      salesOrder.setCurrentSublistValue({
        sublistId: "item",
        fieldId: "price",
        value: 7
      });

      salesOrder.commitLine({ sublistId: "item" });
    });

    const salesOrderId = salesOrder.save({
      ignoreMandatoryFields: false,
      enableSourcing: false
    });

    return {
      id: salesOrderId
    };
  }

  return {
    post: store
  };
});
