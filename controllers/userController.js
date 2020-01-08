'use strict'
const UserModel = require('../models/userSchema')
const SmsController = require('../controllers/smsController')
const makeCode = require('../utils/makeCode')
const makePassword = require('../utils/makePassword')
const AuthController = require('../controllers/authController')
const EmailController = require('./emailController')
const OrderSchema = require('../models/orderServiceSchema')
const uuid = require('node-uuid')

class User {
  async create (data) {
    const isExist = await UserModel.get({ email: data.email })
    if (!isExist._id) {
      const pr = await makeCode()
      console.log(pr)
      data.verifyCode = await makeCode()
      if (data.rol === 'domiciliary' || data.rol === 'administrator') {
        data.isActive = true
        const user = await UserModel.create(data)
        return { estado: true, data: user, mensaje: null }
      } else {
        const user = await UserModel.create(data)
        if (user._id) {
          SmsController.send(data.cellPhone, 'Bienvenido DíaMarket tu código de verificación es ' + data.verifyCode)
          return { estado: true, data: user, mensaje: null }
        } else {
          return { estado: false, data: [], mensaje: 'Error al almacenar los datos' }
        }
      }
    } else {
      return { estado: false, data: [], mensaje: 'El usuario ya se encuentra registrado en el sistema' }
    }
  }

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
    const user = await UserModel.get({ verifyCode: data.code, email: data.email })
    if (user._id) {
      const passwordCrypt = await makePassword(data.password)
      const update = await UserModel.update(user._id, { password: passwordCrypt, verifyCode: codeRandom })
      return update
    } else {
      return { estado: false, data: [], mensaje: 'El código u correo no coincide' }
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
      return { estado: false, data: [], mensaje: 'La dirección no se ha creado' }
    }
  }

  async detail (id) {
    const user = await UserModel.get(id)
    if (user._id) {
      return { estado: true, data: user, mensaje: null }
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
}

module.exports = new User()
