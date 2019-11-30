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
    salesOrder.setValue({ fieldId: "terms", value: "10" });
    salesOrder.setValue({
      fieldId: "custbody_enl_operationtypeid",
      value: "1"
    });
    salesOrder.setValue({
      fieldId: "custbody_enl_order_documenttype",
      value: "1"
    });
    if (context.shipping_cost === 0) {
      salesOrder.setValue({ fieldId: "custbody_enl_freighttype", value: "1" });
    } else {
      salesOrder.setValue({ fieldId: "custbody_enl_freighttype", value: "2" });
    }

    const shippingAddress = salesOrder.getSubrecord({
      fieldId: "shippingaddress"
    });

    shippingAddress.setValue({
      fieldId: "addr1",
      value: context.shipping_street
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
        value: product.pivot.quantity
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
