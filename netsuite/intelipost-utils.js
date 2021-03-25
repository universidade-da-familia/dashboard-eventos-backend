/**
 *
 * @NModuleScope public
 * Utils functions intelipost
 * @author Lucas Corvelo
 * @author Vinícius Simões
 * @since 2018.5
 *
 * Version      Date            Author              Remarks
 * 2.0          24.02.2021      Sonia Libório       CS 11422
 */

define([
  "N/search",
  "N/https",
  "N/xml",
  "../config/acs_intelipost_cts",
], function (search, https, xml, intelipost_cts) {
  function addBusinessDaysToToday(daysToAdd) {
    const today = new Date();
    const day = today.getDay();
    today.setDate(
      today.getDate() +
        daysToAdd +
        (day === 6 ? 2 : +!day) +
        Math.floor((daysToAdd - 1 + (day % 6 || 1)) / 5) * 2
    );
    return today;
  }

  function validateDate(time, daysToAdd) {
    const dateParsed = new Date(time);

    return isNaN(time) ? addBusinessDaysToToday(daysToAdd) : dateParsed;
  }

  function getItemInformations(itemId) {
    const itemResultset = search.lookupFields({
      type: search.Type.ITEM,
      id: itemId,
      columns: [
        "itemid",
        "custitem_enl_length",
        "custitem_enl_height",
        "custitem_enl_width",
        "salesdescription",
        "custitem_enl_weight",
        // 'custitem_rsc_producttypefield'
      ],
    });

    return {
      sku: itemResultset["itemid"],
      length: Number(itemResultset["custitem_enl_length"]) || 1,
      height: Number(itemResultset["custitem_enl_height"]) || 1,
      width: Number(itemResultset["custitem_enl_width"]) || 1,
      description: itemResultset["salesdescription"],
      weight: Number(itemResultset["custitem_enl_weight"]),
      // category: itemResultset['custitem_rsc_producttypefield'][0]['text']
    };
  }

  function getProductsInformations(transaction, lineId) {
    const lineItemCount = transaction.getLineCount({ sublistId: "item" });

    return Array.apply(null, Array(lineItemCount)).reduce(function (
      itemArray,
      item,
      index
    ) {
      const itemLine = transaction.getSublistValue({
        sublistId: "item",
        line: index,
        fieldId: "shipgroup",
      });

      if (lineId && Number(itemLine) !== Number(lineId)) return itemArray;

      const itemInformations = getItemInformations(
        transaction.getSublistValue({
          sublistId: "item",
          line: index,
          fieldId: "item",
        })
      );
      const quantity = transaction.getSublistValue({
        sublistId: "item",
        line: index,
        fieldId: "quantity",
      });
      const itemPrice = transaction.getSublistValue({
        sublistId: "item",
        line: index,
        // fieldId: 'itemunitprice'
        fieldId: "rate",
      });

      return itemArray.concat({
        // weight: Number((quantity * itemInformations.weight).toFixed(3)),
        weight: parseFloat(itemInformations.weight).toFixed(3),
        cost_of_goods: itemPrice,
        width: itemInformations.width,
        height: itemInformations.height,
        length: itemInformations.length,
        quantity: quantity,
        sku_id: itemInformations.sku,
        product_category: itemInformations.category,
        description: itemInformations.description,
        can_group: true,
      });
    },
    []);
  }

  function getCustomerInfo(customerId) {
    return search.lookupFields({
      type: search.Type.CUSTOMER,
      id: customerId,
      columns: [
        "companyname",
        "altname",
        "firstname",
        "middlename",
        "lastname",
        "email",
        "phone",
        "mobilephone",
        "isperson",
        "custentity_psg_br_cpf",
        "custentity_psg_br_cnpj",
      ],
    });
  }

  function getMunicipioName(municipio) {
    return search
      .create({
        type: "customrecord_sit_municipio",
        filters: [
          search.createFilter({
            name: "internalid",
            operator: search.Operator.IS,
            values: [municipio],
          }),
        ],
        columns: [
          "custrecord_sit_municipio_t_ds_municipi",
          "custrecord_sit_municipio_t_sg_unid_fed",
        ],
      })
      .run()
      .getRange({ start: 0, end: 1 })
      .reduce(function (acc, cityResult) {
        return cityResult.getValue(cityResult.columns[0]);
      }, "");
  }

  function getLogradouroName(logradouroId) {
    return search
      .create({
        type: "customlist_sit_lista_tp_logr",
        filters: [
          search.createFilter({
            name: "internalid",
            operator: search.Operator.IS,
            values: [logradouroId],
          }),
        ],
        columns: ["name"],
      })
      .run()
      .getRange({ start: 0, end: 1000 })
      .reduce(function (acc, logradouroResult) {
        return logradouroResult.getValue(logradouroResult.columns[0]);
      }, "");
  }

  function getNodeText(xmlDoc, tagName) {
    const tag = xmlDoc.getElementsByTagName({ tagName: tagName });
    return tag.length ? tag[0].textContent : "";
  }

  function getAddressById(addressId) {
    if (!addressId) return {};

    const response = https.get({
      url:
        "/app/common/address/transactionaddress.nl?e=T&xml=t&id=" + addressId,
    });
    const addressXML = xml.Parser.fromString({
      text: response.body,
    });
    const getShipFieldText = getNodeText.bind(null, addressXML);

    return {
      id: getShipFieldText("id"),
      address: getShipFieldText("addr1"),
      state: getShipFieldText("state"),
      zip: getShipFieldText("zip"),
      neighborhood: getShipFieldText("custrecord_sit_address_t_bairro"),
      complement: getShipFieldText("custrecord_sit_address_complemento"),
      county: getMunicipioName(
        getShipFieldText("custrecord_o2g_address_l_mun")
      ),
      number: getShipFieldText("custrecord_sit_address_i_numero"),
      addressType: getLogradouroName(
        getShipFieldText("custrecord_sit_address_l_tp_logr")
      ),
      country: getShipFieldText("country"),
      fullAddress: getShipFieldText("addrtext"),
      entity: getShipFieldText("entity"),
      override: getShipFieldText("override") === "T",
      defaultBilling: getShipFieldText("defaultbilling") === "T",
      defaultShipping: getShipFieldText("defaultshipping") === "T",
    };
  }

  function getLocationZipCode(locationId) {
    return search.lookupFields({
      type: search.Type.LOCATION,
      id: locationId,
      columns: ["zip"],
    })["zip"];
  }

  function getTransactionAddress(currentRecord, addressId) {
    const zip = currentRecord.getValue({ fieldId: "shipzip" });

    if (zip) {
      const subRecord = currentRecord.getSubrecord({
        fieldId: "shippingaddress",
      });
      return {
        address: subRecord.getValue({ fieldId: "addr1" }),
        addressText: subRecord.getValue({ fieldId: "addrtext" }),
        city: subRecord.getValue({ fieldId: "city" }),
        country: subRecord.getValue({ fieldId: "country" }),
        state: subRecord.getValue({ fieldId: "state" }),
        zip: zip,
      };
    }

    const ilAddrCount = currentRecord.getLineCount({ sublistId: "iladdrbook" });
    const getIlAddrValue = function (line, field) {
      return currentRecord.getSublistValue({
        sublistId: "iladdrbook",
        fieldId: field,
        line: line,
      });
    };

    return Array.apply(null, new Array(ilAddrCount)).reduce(function (
      addrObj,
      el,
      line
    ) {
      const getValue = getIlAddrValue.bind(null, line);
      const ilAddrId = getValue("iladdrinternalid");

      return ilAddrId === addressId
        ? {
            defaultBilling: getValue("iladdrisdefaultbill") === "T",
            defaultShipping: getValue("iladdrisdefaultship") === "T",
            address: getValue("iladdrshipaddr1"),
            addressText: getValue("iladdrshipaddr"),
            city: getValue("iladdrshipcity"),
            country: getValue("iladdrshipcountry"),
            state: getValue("iladdrshipstate"),
            zip: getValue("iladdrshipzip"),
            isResidential: getValue("iladdrshipisresidential") === "T",
          }
        : addrObj;
    },
    {});
  }

  function checkVolumeList(currentRecord) {
    var lines = currentRecord.getLineCount({
      sublistId: intelipost_cts.ITEM_FULLFILMENT.SUBLISTS.INTELIPOST.ID,
    });
    return lines < 1;
  }

  function recipientFirstLastName(recipient, customer, isPerson) {
    var recipientObj = {
      firstName: "",
      lastName: "",
    };
    if (!!recipient) {
      var recipientArray = recipient.split(" ");
      if (recipientArray.length > 0) {
        if (recipientArray.length > 3) {
          for (var n = 0; n < recipientArray.length; n++) {
            if (n < 2) {
              if (!!recipientObj.firstName)
                recipientObj.firstName += " " + recipientArray[n];
              else recipientObj.firstName = recipientArray[n];
            } else {
              if (!!recipientObj.lastName)
                recipientObj.lastName += " " + recipientArray[n];
              else recipientObj.lastName = recipientArray[n];
            }
          }
        } else {
          if (recipientArray.length == 3) {
            recipientObj.firstName =
              recipientArray[0] + " " + recipientArray[1];
            recipientObj.lastName = recipientArray[2];
          } else {
            recipientObj.firstName = recipientArray[0];
            recipientObj.lastName = recipientArray[1];
          }
        }
      }
    }
    if (!recipientObj.firstName) {
      if (!!isPerson) recipientObj.firstName = customer.firstname;
      else recipientObj.firstName = customer.companyname;
    }
    if (!recipientObj.lastName) {
      if (!!isPerson) recipientObj.lastName = customer.lastname;
      else recipientObj.lastName = customer.companyname;
    }
    return recipientObj;
  }

  return {
    validateDate: validateDate,
    getProductsInformations: getProductsInformations,
    getCustomerInfo: getCustomerInfo,
    getAddressById: getAddressById,
    getTransactionAddress: getTransactionAddress,
    getLocationZipCode: getLocationZipCode,
    checkVolumeList: checkVolumeList,
    recipientFirstLastName: recipientFirstLastName,
  };
});
