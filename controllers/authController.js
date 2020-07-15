'use strict'
const jwt = require('jsonwebtoken')
const UserModel = require('../models/userSchema')
const makePassword = require('../utils/makePassword')
const MakeCode = require('../utils/makeCode')
const { sendSms } = require('../utils/makeSms')
const SECRET = 'Cb6t%5UpGtx-G@jUM[RG~Aei8k8MKStC]=}pBlIT:C-9jr2{8fVaLZNUmqt%'
const AdminFirebase = require('firebase-admin')

class Auth {
  async createToken(data) {
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

  async createTokenFirebase(data) {
    let user
    const verifyToken = await AdminFirebase.auth().verifyIdToken(data.token)
    const userFirebase = await AdminFirebase.auth().getUser(verifyToken.uid)
    userFirebase.providerData.forEach(obj => user = obj)
    const userDataBase = await UserModel.get({ email: user.email })
    if (userDataBase._id) {
      await UserModel.update(userDataBase._id, { uidFireBase: user.uid, tokenAuth: data.token, tokenCloudingMessagin: data.tokenCloudingMessagin, idSocket: data.idSocket })
      const token = jwt.sign({ _id: userDataBase._id }, SECRET, { algorithm: 'HS512', expiresIn: 3600 * 24 })
      return { estado: true, data: { token: token, user: userDataBase }, mensaje: null }
    } else {
      const dataUser = {
        uidFireBase: user.uid,
        tokenAuth: data.token,
        tokenCloudingMessagin: data.tokenCloudingMessagin,
        rol: 'client',
        password: '0000',
        isActive: true,
        idSocket: data.idSocket
      }
      user.phoneNumber ? dataUser.cellPhone = user.phoneNumber : dataUser.cellPhone = '000000000000'
      user.photoURL ? dataUser.image = user.photoURL : dataUser.image = 'no aplica'
      user.displayName ? dataUser.name = user.displayName : 'no aplica'
      user.email ? dataUser.email = user.email : dataUser.email = 'noaplica@firebase.com'
      const newUserFirebase = await UserModel.create(dataUser)
      const userNew = await UserModel.get({ _id: newUserFirebase })
      const token = jwt.sign({ _id: newUserFirebase._id }, SECRET, { algorithm: 'HS512', expiresIn: 3600 * 24 })
      return { estado: true, data: { token: token, user: userNew }, mensaje: null }
    }

  }

  async createTokenUser(user) {
    const token = jwt.sign({ _id: user._id }, SECRET, { algorithm: 'HS512', expiresIn: 3600 * 24 })
    return { estado: true, data: { token: token, user: user }, mensaje: null }
  }

  async sendCode(email) {
    const user = await UserModel.get(email)
    if (user._id) {
      const code = await MakeCode()
      console.log(user)
      await sendSms(user.cellPhone, code)
      return UserModel.update(user._id, { verifyCode: code })
    } else {
      return { estado: false, data: [], mensaje: 'El usuario no existe' }
    }
  }

  async resetPassword(data) {
    const user = await UserModel.get({ verifyCode: data.code })
    if (user._id) {
      const password = await makePassword(data.password)
      return UserModel.update(user._id, { password })
    } else {
      return { estado: false, data: [], mensaje: 'El usuario no existe' }
    }
  }
}
module.exports = new Auth()
