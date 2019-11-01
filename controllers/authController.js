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
                return {
                    token: token,
                    user: dataUser
                }
            }
            return { error: 'Usuario no validado o usuario y/o contraseña incorrectos', statusCode: '401' }
        }
        return { error: 'Usuario y contraseña son obligatorios', statusCode: '401' }
    }
}
module.exports = new Auth()