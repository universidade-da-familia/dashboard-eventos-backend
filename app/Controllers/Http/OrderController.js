/* eslint-disable no-unused-expressions */
'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Order = use('App/Models/Order')

const axios = require('axios')

const api = axios.default.create({
  baseURL: 'https://api.payulatam.com',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
})

const apiNetsuite = axios.default.create({
  baseURL: 'https://5260046.restlets.api.netsuite.com/app/site/hosting',
  headers: {
    'Content-Type': 'application/json',
    Authorization:
      'NLAuth nlauth_account=5260046, nlauth_email=dev@udf.org.br, nlauth_signature=Shalom1234,nlauth_role=1077'
  }
})

class OrderController {
  /**
   * Show a list of all orders.
   * GET orders
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index () {
    const order = Order.query().fetch()

    return order
  }

  /**
   * Create/save a new order.
   * POST orders
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
    try {
      const data = request.all()
      const {
        user,
        card,
        products,
        shipping_address,
        shipping_option,
        order_details,
        payu
      } = data

      const responsePayu = await api.post(
        '/payments-api/4.0/service.cgi',
        payu
      )

      const { data: payuData } = responsePayu

      if (
        card !== null &&
        payuData.transactionResponse.responseCode !== 'APPROVED'
      ) {
        return response.status(400).send({
          title: 'Falha!',
          message: 'Houve um problema com o pagamento.',
          payu: payuData.transactionResponse.responseCode
        })
      }

      const orderNetsuite = {
        entity: user,
        products,
        card,
        installments:
          card !== null
            ? payu.transactions.extraParameters.INSTALLMENTS_NUMBER
            : 1,
        payu_order_id: payu.transaction.order.referenceCode,
        payu_json:
          card === null
            ? payuData.transactionResponse.extraParameters
              .URL_PAYMENT_RECEIPT_HTML
            : 'Pagamento aprovado com cartão de crédito',
        shipping_cost: order_details.shipping_amount,
        shipping_cep: shipping_address.cep,
        shipping_uf: shipping_address.uf,
        shipping_city: shipping_address.city,
        shipping_street: shipping_address.street,
        shipping_street_number: shipping_address.street_number,
        shipping_neighborhood: shipping_address.neighborhood,
        shipping_complement: shipping_address.complement,
        shipping_receiver: shipping_address.receiver,
        shipping_option
      }

      const responseNetsuite = await apiNetsuite.post(
        '/restlet.nl?script=185&deploy=1',
        orderNetsuite
      )

      const order = await Order.create({
        netsuite_id: responseNetsuite.data.id,
        status_id: card === null ? 1 : 2,
        entity_id: user.id,
        payment_name: card === null ? 'Boleto' : 'Cartão de crédito',
        shipping_name: shipping_option.delivery_method_name,
        delivery_estimate_days:
          shipping_option.delivery_estimate_transit_time_business_days,
        shipping_cost: order_details.shipping_amount,
        total: order_details.amount,
        shipping_cep: shipping_address.cep,
        shipping_uf: shipping_address.uf,
        shipping_city: shipping_address.city,
        shipping_street: shipping_address.street,
        shipping_street_number: shipping_address.street_number,
        shipping_neighborhood: shipping_address.neighborhood,
        shipping_complement: shipping_address.complement,
        shipping_receiver: shipping_address.receiver
      })

      await order.products().attach(
        products.map(product => product.id),
        row => {
          const product = products.find(
            product => product.id === row.product_id
          )

          row.quantity = product.quantity
          row.total = product.cost_of_goods * product.quantity
        }
      )

      const transaction = await order.transaction().create({
        order_id: order.id,
        transaction_id: payuData.transactionResponse.transactionId,
        api_order_id: payuData.transactionResponse.orderId,
        status: payuData.transactionResponse.state,
        boleto_url:
          card === null
            ? payuData.transactionResponse.extraParameters
              .URL_PAYMENT_RECEIPT_HTML
            : null
      })

      order.products = await order.products().fetch()
      order.transaction = transaction || order.transaction

      return order
    } catch (err) {
      return response.status(err.status).send({
        error: {
          title: 'Falha!',
          message: 'Erro ao criar o pedido'
        }
      })
    }
  }

  /**
   * Display a single order.
   * GET orders/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, response }) {
    try {
      const order = await Order.findOrFail(params.id)

      await order.loadMany([
        'status',
        'transaction',
        'organization',
        'entity',
        'products'
      ])

      return order
    } catch (err) {
      return response.status(err.order).send({
        error: {
          title: 'Falha!',
          message: 'Nenhum pedido encontrado.'
        }
      })
    }
  }

  /**
   * Update order details.
   * PUT or PATCH orders/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
    try {
      const data = request.all()

      const order = await Order.findOrFail(params.id)

      order.merge(data)

      await order.save()

      return order
    } catch (err) {
      return response.status(err.status).send({
        error: {
          title: 'Falha!',
          message: 'Erro ao atualizar o pedido'
        }
      })
    }
  }

  /**
   * Delete a order with id.
   * DELETE orders/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
    try {
      const order = await Order.findOrFail(params.id)

      await order.delete()

      return response.status(200).send({
        title: 'Sucesso!',
        message: 'O pedido foi removido.'
      })
    } catch (err) {
      return response.status(err.status).send({
        error: {
          title: 'Falha!',
          message: 'Erro ao excluir o pedido'
        }
      })
    }
  }
}

module.exports = OrderController
