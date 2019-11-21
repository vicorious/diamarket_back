'use strict'
const jwt = require('jsonwebtoken')
const UserModel = require('../models/userSchema')
const makePassword = require('../utils/makePassword')
const SECRET = 'Cb6t%5UpGtx-G@jUM[RG~Aei8k8MKStC]=}pBlIT:C-9jr2{8fVaLZNUmqt%'
class Auth {
    async createToken(data) {
        if (data.email && data.password) {
            const password = makePassword(data.password)
            const dataUser = await UserModel.get({ "email": data.email, "password": password, "isActive": true })
            if (dataUser._id) {
                const token = jwt.sign({ _id: dataUser._id }, SECRET, { algorithm: 'HS512', expiresIn: 3600 * 24 })

                return {estado:true, data:{ token: token}, mensaje: null, user : dataUser }
            }
            return {estado:false, data:[], mensaje: 'Usuario no validado o usuario y/o contraseña incorrectos' }
        }
        return {estado:false, data:[], mensaje: 'Usuario no validado o usuario y/o contraseña incorrectos' }
    }
    async createTokenBackoffice(data) {
        if (data.email && data.password) {
            const password = makePassword(data.password)
            const administrator = await UserModel.get({ "email": data.email, "password": password, "isActive": true, "rol": "administrator" })
            const superAdministrator = await UserModel.get({ "email": data.email, "password": password, "isActive": true, "rol": "superadministrator" })


            if (administrator._id) {
                const token = jwt.sign({ _id: administrator._id }, SECRET, { algorithm: 'HS512', expiresIn: 3600 * 24 })
                return {estado:true, data:{ token: token}, mensaje: null, user : administrator }
            } else if (superAdministrator._id) {
                const token = jwt.sign({ _id: superAdministrator._id }, SECRET, { algorithm: 'HS512', expiresIn: 3600 * 24 })
                return {
                    token: token,
                    user: superAdministrator
                }
            }

            return {estado:false, data:[], mensaje: 'Usuario no validado o usuario y/o contraseña incorrectos' }
        }
        return {estado:false, data:[], mensaje: 'Usuario no validado o usuario y/o contraseña incorrectos' }
    }
}
module.exports = new Auth()
