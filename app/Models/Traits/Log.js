'use strict'

const Config = use('Adonis/Src/Config')
const Auth = use('Adonis/Src/Auth')

class Log {
  register (Model, options) {
    Model.addHook('beforeUpdate', async function (modelInstance) {
      const auth = new Auth({}, Config)
      const user = await auth.getUser()

      console.log(user)
      console.log(options)
      // console.log(Model)
      // console.log(modelInstance)
    })
  }

  // show ({ auth }) {
  //   return auth.user
  // }
}

module.exports = Log
