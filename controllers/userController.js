'use strict'

const UserModel = require('../models/userShema')
const SmsController = require('../controllers/smsController')
const GeneralController = require('../controllers/generalController')
const EmailController = require('../controllers/emailController')
const makePassword = require('../utils/makePassword')

class User {

    async create(data) {
        const isExist = await UserModel.get({ email: data.email })
        if (!isExist._id) {
            data.verifyCode = GeneralController.createCode()
            const user = await UserModel.create(data)
            if (user._id) {
                SmsController.send(data.cellPhone, 'Bienvenido DíaMarket tu código de verificación es ' + data.verifyCode)
                return user
            } else {
                return { error: 'Error al almacenar los datos', user }
            }

        } else {
            return { error: 'El usuario ya existe' }
        }
    }

    async validate(data) {
        const isExist = await UserModel.get({ email: data.email, verifyCode: data.code })
        if (isExist._id) {
            const code = GeneralController.createCode()
            const update = await UserModel.update(isExist._id, { isActive: true, verifyCode: code })
            return update
        } else {
            return { error: 'El código de autencticación no es valido' }
        }
    }

    async updateVeryfycode(email) {
        const code = GeneralController.createCode()
        const isExist = await UserModel.get({ email })
        if (isExist._id) {
            await EmailController.send(email, `Su codigo de verificacion es: ${code}`)
            return UserModel.update(isExist._id, { verifyCode: code })
        } else {
            return { error: 'No se ha actualizado el código de recuperación' }
        }
    }

    async updatePassword(_data) {

        const codeRandom = GeneralController.createCode()

        const data = await UserModel.get({ verifyCode: _data.code, email: _data.email })
        if (data._id) {
            const encriptar = makePassword(_data.password)
            return await UserModel.update(data._id, { password: encriptar, verifyCode: codeRandom })
        } else {
            return { error: 'El código u correo no coincide' }
        }
    }
}

module.exports = new User()