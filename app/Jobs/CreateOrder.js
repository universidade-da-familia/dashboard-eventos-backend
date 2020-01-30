'use strict'

const Order = use('App/Models/Order')

const axios = require('axios')

const api = axios.default.create({
  baseURL: 'https://5260046.restlets.api.netsuite.com/app/site/hosting',
  headers: {
    'Content-Type': 'application/json',
    Authorization:
      'NLAuth nlauth_account=5260046, nlauth_email=dev@udf.org.br, nlauth_signature=Shalom1234,nlauth_role=1077'
  }
})

class CreateOrder {
  // If this getter isn't provided, it will default to 1.
  // Increase this number to increase processing concurrency.
  static get concurrency () {
    return 1
  }

  // This is required. This is a unique key used to identify this job.
  static get key () {
    return 'CreateOrder-job'
  }

  // This is where the work is done.
  async handle ({ orderNetsuite, order_id }) {
    console.log('CreateOrder-job started')
    console.log('antes netsuite')

    const response = await api.post(
      '/restlet.nl?script=189&deploy=1',
      orderNetsuite
    )

    console.log(response.data)
    console.log('depois netsuite')

    if (response.data.id) {
      const order = await Order.findOrFail(order_id)

      order.netsuite_id = response.data.id || order.netsuite_id

      await order.save()
    }
  }
}

module.exports = CreateOrder
