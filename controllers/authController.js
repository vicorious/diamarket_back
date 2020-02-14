'use strict'
const jwt = require('jsonwebtoken')
const UserModel = require('../models/userSchema')
const makePassword = require('../utils/makePassword')
const MakeCode = require('../utils/makeCode')
const { sendSms } = require('../utils/makeSms')
const SECRET = 'Cb6t%5UpGtx-G@jUM[RG~Aei8k8MKStC]=}pBlIT:C-9jr2{8fVaLZNUmqt%'

class Auth {
  async createToken (data) {
    if (data.email && data.password) {
      const password = makePassword(data.password)
      const dataUser = await UserModel.get({ email: data.email, password: password, isActive: true })
      if (dataUser._id) {
        const token = jwt.sign({ _id: dataUser._id }, SECRET, { algorithm: 'HS512', expiresIn: 3600 * 24 })
        return { estado: true, data: { token: token, user: dataUser }, mensaje: null }
      }
      return { estado: false, data: [], mensaje: 'Usuario no validado o usuario y/o contraseña incorrectos' }
    }
    return { estado: false, data: [], mensaje: 'Usuario no validado o usuario y/o contraseña incorrectos' }
  }

  async createTokenUser (user) {
    const token = jwt.sign({ _id: user._id }, SECRET, { algorithm: 'HS512', expiresIn: 3600 * 24 })
    return { estado: true, data: { token: token, user: user }, mensaje: null }
  }

  async createTokenSocial (data) {
    const user = await UserModel.get({ email: data.email })
    if (user._id) {
      const token = await this.createTokenUser(user)
      return token
    } else {
      return { estado: false, data: [], mensaje: 'El correo del usuario no existe' }
    }
  }

  async sendCode (email) {
    const user = await UserModel.get(email)
    if (user._id) {
      const code = await MakeCode()
      await sendSms(user.cellPhone, code)
      return UserModel.update(user._id, { verifyCode: code })
    } else {
      return { estado: false, data: [], mensaje: 'El usuario no existe' }
    }
  }

  async resetPassword (data) {
    const user = await UserModel.get({ verifyCode: data.code })
    console.log(user)
    if (user._id) {
      const password = await makePassword(data.password)
      console.log(password)
      return UserModel.update(user._id, { password })
    } else {
      return { estado: false, data: [], mensaje: 'El usuario no existe' }
    }
  }
}
module.exports = new Auth()
