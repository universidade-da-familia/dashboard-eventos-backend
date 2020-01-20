/* eslint-disable */
/**
 *@author Lucas Alves
 *
 *@NApiVersion 2.x
 *@NScriptType Restlet
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
        id: context.netsuite_id,
        isDynamic: true
      });

      if(context.addressesPost && context.addressesPost.length > 0) {
        customer.selectNewLine({ sublistId: "addressbook" });

        context.addressesPost.forEach(function(address) {
          const searchColumns = ["internalid"]
          const ufIds = search.create({
            type: "customlist_enl_state",
            filters: [
              ["name", "is", address.uf]
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
            })
          const cityIds = search.create({
              type: "customrecord_enl_cities",
              filters: [
                ["name", "is", address.city]
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
              })

          log.debug({ "title": "ufs", "details": ufIds });
          log.debug({ "title": "cities", "details": cityIds });

          const addressSubrecord = customer.getCurrentSublistSubrecord({
            sublistId: 'addressbook',
            fieldId: 'addressbookaddress'
          });

          if(address.type === "other") {
            customer.setCurrentSublistValue({
              sublistId: "addressbook",
              fieldId: "label",
              value: address.other_type_name || address.street
            });
          } else if(address.type === "home") {
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
            value: address.cep
          });
          addressSubrecord.setValue({
            fieldId: "addr1",
            value: address.street
          });
          addressSubrecord.setValue({
            fieldId: "custrecord_enl_numero",
            value: address.street_number
          });
          addressSubrecord.setValue({
            fieldId: "addr2",
            value: address.complement
          });
          addressSubrecord.setValue({
            fieldId: "addr3",
            value: address.neighborhood
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
            value: address.receiver
          });

          customer.commitLine({ sublistId: "addressbook" });
        });
      }

      if(context.addressesPut && context.addressesPut.length > 0) {
        context.addressesPut.forEach(function(address) {
          const searchColumns = ["internalid"]
          const ufIds = search.create({
            type: "customlist_enl_state",
            filters: [
              ["name", "is", address.uf]
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
            })
          const cityIds = search.create({
              type: "customrecord_enl_cities",
              filters: [
                ["name", "is", address.city]
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
              })

          const lineNumber = customer.findSublistLineWithValue({
            sublistId: "addressbook",
            fieldId: "id",
            value: parseInt(address.netsuite_id)
          });

          customer.selectLine({
            sublistId: 'addressbook',
            line: lineNumber
          });

          const addressSubrecord = customer.getCurrentSublistSubrecord({
            sublistId: 'addressbook',
            fieldId: 'addressbookaddress'
          });

          if(address.type === "other") {
            customer.setCurrentSublistValue({
              sublistId: "addressbook",
              fieldId: "label",
              value: address.other_type_name || address.street
            });
          } else if(address.type === "home") {
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
            value: address.cep,
          });
          addressSubrecord.setValue({
            fieldId: "addr1",
            value: address.street,
          });
          addressSubrecord.setValue({
            fieldId: "custrecord_enl_numero",
            value: address.street_number
          });
          addressSubrecord.setValue({
            fieldId: "addr2",
            value: address.complement
          });
          addressSubrecord.setValue({
            fieldId: "addr3",
            value: address.neighborhood
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
            value: address.receiver || customer.custentity_enl_legalname
          });

          customer.commitLine({ sublistId: "addressbook" });
        })
      }

      customer.save({
        ignoreMandatoryFields: false,
        enableSourcing: false
      });

      return {
        title: "Sucesso!",
        message: "Os registros foram atualizados."
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
    post: store
  };
});
