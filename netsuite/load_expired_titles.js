/* eslint-disable */
/**
 *@author Lucas Alves
 *
 *@NApiVersion 2.x
 *@NScriptType Restlet
 */
define(['N/search'], function (search) {
  /**
   * Columns to be retrieved in the search.
   *
   * @type {object[]}
   */

  function index () {
    return search.load({
      id: 'customsearch235'
    })
      .run()
      .getRange({
        start: 0,
        end: 1000
      })
      .map(function (result) {
        const cpf = result.getValue({
          name: "custentity_enl_cnpjcpf",
          join: "customer",
        })
        return cpf
      })
  }

  return {
    get: index
  }
})
