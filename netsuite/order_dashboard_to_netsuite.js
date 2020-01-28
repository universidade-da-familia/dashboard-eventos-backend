/* eslint-disable */
/**
 *@author Lucas Alves
 *
 *@NApiVersion 2.x
 *@NScriptType Restlet
 *@NModuleScope SameAccount
 */
define(["N/record", "N/search"], function(record, search) {
  /**
   * POST.
   *
   * @param context
   */
  function store(context) {
    try {
      const customer = record.load({
        type: record.Type.CUSTOMER,
        id: context.entity.netsuite_id,
        isDynamic: true
      });

      const searchColumns = ["internalid"];
      const ufIds = search.create({
        type: "customlist_enl_state",
        filters: [
          ["name", "is", context.shipping_uf]
        ],
        columns: searchColumns
      })
        .run()
        .getRange({
          start: 0,
          end: 1000
        })
        .map(function (result) {
          const id = result.getValue({ name: "internalid" });

          return id;
        });

      const cityIds = search.create({
          type: "customrecord_enl_cities",
          filters: [
            ["name", "is", context.shipping_city]
          ],
          columns: searchColumns
        })
          .run()
          .getRange({
            start: 0,
            end: 1000
          })
          .map(function (result) {
            const id = result.getValue({ name: "internalid" });

            return id;
          });

      if(context.is_new_address) {
        customer.selectNewLine({ sublistId: "addressbook" });

        const addressSubrecord = customer.getCurrentSublistSubrecord({
          sublistId: 'addressbook',
          fieldId: 'addressbookaddress'
        });

        customer.setCurrentSublistValue({
          sublistId: "addressbook",
          fieldId: "defaultbilling",
          value: true
        });
        customer.setCurrentSublistValue({
          sublistId: "addressbook",
          fieldId: "defaultshipping",
          value: true
        });

        if(context.shipping_type === "other") {
          customer.setCurrentSublistValue({
            sublistId: "addressbook",
            fieldId: "label",
            value: context.shipping_other_type_name || context.shipping_street
          });
        } else if(context.shipping_type === "home") {
          customer.setCurrentSublistValue({
            sublistId: "addressbook",
            fieldId: "label",
            value: "Minha casa"
          });
        } else {
          customer.setCurrentSublistValue({
            sublistId: "addressbook",
            fieldId: "label",
            value: "Meu trabalho"
          });
        }

        addressSubrecord.setValue({
          fieldId: "country",
          value: "BR"
        });
        addressSubrecord.setValue({
          fieldId: "zip",
          value: context.shipping_cep
        });
        addressSubrecord.setValue({
          fieldId: "addr1",
          value: context.shipping_street
        });
        addressSubrecord.setValue({
          fieldId: "custrecord_enl_numero",
          value: context.shipping_street_number
        });
        addressSubrecord.setValue({
          fieldId: "addr2",
          value: context.shipping_complement
        });
        addressSubrecord.setValue({
          fieldId: "addr3",
          value: context.shipping_neighborhood
        });
        addressSubrecord.setValue({
          fieldId: "custrecord_enl_uf",
          value: parseInt(ufIds[0]) || ""
        });
        addressSubrecord.setValue({
          fieldId: "custrecord_enl_city",
          value: parseInt(cityIds[0]) || ""
        });
        addressSubrecord.setValue({
          fieldId: "addressee",
          value: context.shipping_receiver
        });
        addressSubrecord.setValue({
          fieldId: "custrecordudf_dashboard_address_id",
          value: context.address_id
        });

        customer.commitLine({ sublistId: "addressbook" });
      } else {
        const numberOfAddresses = customer.getLineCount({
          sublistId: "addressbook"
        });

        if(numberOfAddresses > 0) {
          var addressFound = false;

          for (var index = 0; index < numberOfAddresses; index += 1) {
            customer.selectLine({
              sublistId: "addressbook",
              line: index
            });

            const addressSubrecord2 = customer.getCurrentSublistSubrecord({
              sublistId: 'addressbook',
              fieldId: 'addressbookaddress'
            });

            log.debug({ "title": "subadress", "details": addressSubrecord2 });

            const addressId = addressSubrecord2.getCurrentSublistValue({
              sublistId: 'addressbook',
              fieldId: 'custrecordudf_dashboard_address_id'
            });

            log.debug({ "title": "addressid", "details": addressId });

            if(addressId === context.address_id) {
              addressFound = true;

              customer.setCurrentSublistValue({
                sublistId: "addressbook",
                fieldId: "defaultbilling",
                value: true
              });

              customer.setCurrentSublistValue({
                sublistId: "addressbook",
                fieldId: "defaultshipping",
                value: true
              });
            }
          }

          if(!addressFound) {
            customer.selectNewLine({ sublistId: "addressbook" });

            const addressSubrecord3 = customer.getCurrentSublistSubrecord({
              sublistId: 'addressbook',
              fieldId: 'addressbookaddress'
            });

            customer.setCurrentSublistValue({
              sublistId: "addressbook",
              fieldId: "defaultbilling",
              value: true
            });
            customer.setCurrentSublistValue({
              sublistId: "addressbook",
              fieldId: "defaultshipping",
              value: true
            });

            if(context.shipping_type === "other") {
              customer.setCurrentSublistValue({
                sublistId: "addressbook",
                fieldId: "label",
                value: context.shipping_other_type_name || context.shipping_street
              });
            } else if(context.shipping_type === "home") {
              customer.setCurrentSublistValue({
                sublistId: "addressbook",
                fieldId: "label",
                value: "Minha casa"
              });
            } else {
              customer.setCurrentSublistValue({
                sublistId: "addressbook",
                fieldId: "label",
                value: "Meu trabalho"
              });
            }

            addressSubrecord3.setValue({
              fieldId: "country",
              value: "BR"
            });
            addressSubrecord3.setValue({
              fieldId: "zip",
              value: context.shipping_cep
            });
            addressSubrecord3.setValue({
              fieldId: "addr1",
              value: context.shipping_street
            });
            addressSubrecord3.setValue({
              fieldId: "custrecord_enl_numero",
              value: context.shipping_street_number
            });
            addressSubrecord3.setValue({
              fieldId: "addr2",
              value: context.shipping_complement
            });
            addressSubrecord3.setValue({
              fieldId: "addr3",
              value: context.shipping_neighborhood
            });
            addressSubrecord3.setValue({
              fieldId: "custrecord_enl_uf",
              value: parseInt(ufIds[0]) || ""
            });
            addressSubrecord3.setValue({
              fieldId: "custrecord_enl_city",
              value: parseInt(cityIds[0]) || ""
            });
            addressSubrecord3.setValue({
              fieldId: "addressee",
              value: context.shipping_receiver
            });
            addressSubrecord3.setValue({
              fieldId: "custrecordudf_dashboard_address_id",
              value: context.address_id
            });

            customer.commitLine({ sublistId: "addressbook" });
          }
        }
      }

      customer.save({
        ignoreMandatoryFields: false,
        enableSourcing: false
      });

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
      } else if (
        context.shipping_option.delivery_method_name === "Retirar na UDF"
      ) {
        salesOrder.setValue({
          fieldId: "memo",
          value: "O líder irá retirar na UDF"
        });

        salesOrder.setValue({
          fieldId: "custbody_enl_legaltext",
          value: "O líder irá retirar na UDF"
        });

        salesOrder.setValue({ fieldId: "custbody_enl_freighttype", value: "10" });

        salesOrder.setValue({
          fieldId: "shipmethod",
          value: ""
        });

        salesOrder.setValue({
          fieldId: "custbody_enl_carrierid",
          value: ""
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

      // const shippingAddress = salesOrder.getSubrecord({
      //   fieldId: "shippingaddress"
      // });

      // shippingAddress.setValue({
      //   fieldId: "addr1",
      //   value: context.shipping_street + ", " + context.shipping_street_number
      // });
      // shippingAddress.setValue({
      //   fieldId: "city",
      //   value: 3901
      // });
      // shippingAddress.setValue({
      //   fieldId: "custrecord_enl_city",
      //   value: 3901
      // });
      // shippingAddress.setValue({
      //   fieldId: "state",
      //   value: context.shipping_uf + " - " + context.shipping_city
      // });
      // shippingAddress.setValue({
      //   fieldId: "zip",
      //   value: context.shipping_cep
      // });
      // // avalara actualization
      // shippingAddress.setValue({
      //   fieldId: "zipcode",
      //   value: context.shipping_cep
      // });
      // shippingAddress.setValue({
      //   fieldId: "addressee",
      //   value: context.shipping_receiver
      // });

      // shippingAddress.setValue({
      //   fieldId: "attention",
      //   value: context.shipping_receiver
      // });

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
          value: 3
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
    } catch (err) {
      return {
        title: "Falha!",
        message: "Houve um erro ao criar o registro",
        erro: err
      };
    }
  }

  return {
    post: store
  };
});
