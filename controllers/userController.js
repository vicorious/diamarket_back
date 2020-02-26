'use strict'
const UserModel = require('../models/userSchema')
const { sendSms } = require('../utils/makeSms')
const makeCode = require('../utils/makeCode')
const makePassword = require('../utils/makePassword')
const AuthController = require('../controllers/authController')
const EmailController = require('./emailController')
const OrderSchema = require('../models/orderServiceSchema')
const SuperMarketSchema = require('../models/supermarketSchema')
const uuid = require('node-uuid')

class User {
  async create (data) {
    const isExists = await UserModel.get({ email: data.email })
    data.verifyCode = await makeCode()
    if (!isExists._id) {
      switch (data.rol) {
        case 'domiciliary': {
          const supermarket = await SuperMarketSchema.get({ idAdmin: data.idAdmin })
          data.workingSupermarket = supermarket._id
          data.isActive = true
          const user = await UserModel.create(data)
          return { estado: true, data: user, mensaje: null }
        }

        case 'administrator': {
          const supermarket = await SuperMarketSchema.get({ _id: data.supermarket })
          data.isActive = true
          const user = await UserModel.create(data)
          await SuperMarketSchema.update(supermarket._id, { idAdmin: user._id })
          return { estado: true, data: user, mensaje: null }
        }

        case 'superadministrador': {
          data.isActive = true
          const user = await UserModel.create(data)
          return { estado: true, data: user, mensaje: null }
        }

        case 'client': {
          const user = await UserModel.create(data)
          if (user._id) {
            await sendSms(data.cellPhone, data.verifyCode)
            return { estado: true, data: user, mensaje: null }
          } else {
            return { estado: false, data: [], mensaje: 'Error al almacenar los datos' }
          }
        }

        default: {
          return { estado: false, data: [], mensaje: 'El rol no existe' }
        }
      }
    } else {
      return { estado: false, data: [], mensaje: 'El usuario ya se encuentra registrado en el sistema' }
    }
  }

  // async create (data) {
  //   const isExist = await UserModel.get({ email: data.email })
  //   if (!isExist._id) {
  //     data.verifyCode = await makeCode()
  //     if (data.rol === 'domiciliary' || data.rol === 'administrator' || data.rol === 'superadministrator') {
  //       if (data.supermarket) {
  //         const supermarket = await SuperMarketSchema.get({ _id: data.supermarket })
  //         data.isActive = true
  //         const user = await UserModel.create(data)
  //         await SuperMarketSchema.update(supermarket._id, { idAdmin: user._id })
  //         return { estado: true, data: user, mensaje: null }
  //       } else if (data.idAdmin) {
  //         const supermarket = await SuperMarketSchema.get({ idAdmin: data.idAdmin })
  //         data.workingSupermarket = supermarket._id
  //         const user = await UserModel.create(data)
  //         return { estado: true, data: user, mensaje: null }
  //       }
  //       data.isActive = true
  //       const user = await UserModel.create(data)
  //       return { estado: true, data: user, mensaje: null }
  //     } else {
  //       const user = await UserModel.create(data)
  //       if (user._id) {
  //         await sendSms(data.cellPhone, data.verifyCode)
  //         return { estado: true, data: user, mensaje: null }
  //       } else {
  //         return { estado: false, data: [], mensaje: 'Error al almacenar los datos' }
  //       }
  //     }
  //   } else {
  //     return { estado: false, data: [], mensaje: 'El usuario ya se encuentra registrado en el sistema' }
  //   }
  // }

  async createSocial (data) {
    const isExist = await UserModel.get({ email: data.email })
    if (!isExist._id) {
      const password = await makeCode()
      data.password = password
      data.identification = data.id
      data.cellphone = '123456789'
      data.rol = 'client'
      data.isActive = true
      delete data.id
      const create = await UserModel.create(data)
      const user = await UserModel.get({ _id: create._id })
      const auth = await AuthController.createTokenUser(user)
      return auth
    } else {
      return { estado: false, data: [], mensaje: 'El usuario ya se encuentra registrado en el sistema' }
    }
  }

  async validate (data) {
    const isExist = await UserModel.get({ email: data.email, verifyCode: data.code })
    if (isExist._id) {
      const code = await makeCode()
      await UserModel.update(isExist._id, { isActive: true, verifyCode: code })
      const userToken = await AuthController.createTokenUser(isExist)
      return userToken
    } else {
      return { estado: false, data: [], mensaje: 'El código de autencticación no es valido' }
    }
  }

  async sendCode (data) {
    const user = await UserModel.get({ cellPhone: data.cellPhone })
    if (user._id) {
      const code = await makeCode()
      await sendSms(data.cellPhone, 'Bienvenido DiaMarket tu codigo de restauracion es ' + code)
      await UserModel.update(user._id, { verifyCode: code })
      return { estado: true, data: { message: 'El sms fue enviado', mensaje: null } }
    } else {
      return { estado: false, data: [], mensaje: 'El usuario no existe' }
    }
  }

  async sendEmailPassword (email) {
    const code = await makeCode()
    const isExist = await UserModel.get({ email })
    if (isExist._id) {
      await EmailController.send(email, `Su codigo de verificacion es: ${code}`)
      const update = await UserModel.update(isExist._id, { verifyCode: code })
      return update
    } else {
      return { estado: false, data: [], mensaje: 'No se ha actualizado el código de recuperación' }
    }
  }

  async updatePassword (data) {
    const codeRandom = await makeCode()
    const user = await UserModel.get({ verifyCode: data.code })
    if (user._id) {
      const passwordCrypt = await makePassword(data.password)
      console.log(passwordCrypt)
      const update = await UserModel.update(user._id, { password: passwordCrypt, verifyCode: codeRandom })
      return update
    } else {
      return { estado: false, data: [], mensaje: 'El código  no coincide' }
    }
  }

  async update (id, data) {
    const isExist = await UserModel.get({ _id: id })
    if (data.password) {
      const encriptar = await makePassword(data.password)
      data.password = encriptar
    }
    if (isExist._id) {
      const update = await UserModel.update(id, data)
      return update
    } else {
      return { estado: false, data: [], mensaje: 'El usuario no ha sido actualizado' }
    }
  }

  async createDirection (_id, data) {
    const isExist = await UserModel.get(_id)
    data.uid = uuid.v4()
    if (isExist._id) {
      if (isExist.directions.length > 0) {
        const update = await UserModel.update(_id, { $push: { directions: data } })
        return update
      } else {
        const update = await UserModel.update(_id, { directions: data })
        return update
      }
    } else {
      return { estado: false, data: [], mensaje: 'El usuario no existe' }
    }
  }

  async detail (id) {
    const user = await UserModel.get(id)
    if (user._id) {
      if (user.rol === 'administrator') {
        const userWitchSupermarket = user
        const supermarket = await SuperMarketSchema.get({ idAdmin: user._id })
        userWitchSupermarket.superMarket._id = supermarket._id ? supermarket._id : 'No asignado'
        userWitchSupermarket.superMarket.name = supermarket.name ? supermarket.name : 'No asignado'
        return { estado: true, data: userWitchSupermarket, mensaje: null }
      } else {
        return { estado: true, data: user, mensaje: null }
      }
    } else {
      return { estado: false, data: [], mensaje: 'El usuario no se encuentra registrado' }
    }
  }

  async all (data) {
    const user = await UserModel.search(data)
    if (user.length > 0) {
      return { estado: true, data: user, mensaje: null }
    } else {
      return { estado: false, data: [], mensaje: 'No se encuentran datos' }
    }
  }

  async clientSupermarket (_id) {
    const orders = await OrderSchema.search({ superMarket: _id })
    const clients = []
    if (orders.length > 0) {
      for (const order of orders) {
        if (clients.length > 0) {
          for (const client of clients) {
            if (client.user !== order.user) {
              client.push(order)
            }
          }
        } else {
          clients.push(order)
        }
      }
    } else {
      return { estado: true, data: [], mensaje: 'Este supermercado no tiene clientes' }
    }
  }

  async administratorsWithoutSupermarket () {
    const users = await UserModel.search({ rol: 'administrator' })
    const supermarkets = await SuperMarketSchema.search({ idAdmin: { $exists: true } })
    const administrators = []
    for (const user of users) {
      for (const supermarket of supermarkets) {
        if (supermarket.idAdmin !== user._id) {
          administrators.push(user)
        }
      }
    }
    if (administrators.length > 0) {
      return { estado: true, data: administrators, mensaje: null }
    } else {
      return { estado: false, data: [], mensaje: 'No hay administradores disponibles para asignar' }
    }
  }

  async clientsForSuperMarket (data) {
    const user = await UserModel.get(data)
    const supermarket = await SuperMarketSchema.get({ idAdmin: user._id })
    const users = await UserModel.search({ supermarketFavorite: supermarket })
    if (users.length > 0) {
      return { estado: true, data: users, mensaje: null }
    } else {
      return { estado: false, data: [], mensaje: 'No hay clientes en este supermercado' }
    }
  }

  async domiciliaryForSuperMarket (_id) {
    const supermarket = await SuperMarketSchema.get({ idAdmin: _id })
    const users = await UserModel.search({ workingSupermarket: supermarket._id })
    if (users.length > 0) {
      return { estado: true, data: users, mensaje: null }
    } else {
      return { estado: false, data: [], mensaje: 'Este supermercado no tiene domiciliarios' }
    }
  }
}

module.exports = new User()
