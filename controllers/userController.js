'use strict'

const UserModel = require('../models/userSchema')
const SmsController = require('../controllers/smsController')
const GeneralController = require('../controllers/generalController')
const EmailController = require('../controllers/emailController')
const makePassword = require('../utils/makePassword')

class User {

    async create(data) {
        const isExist = await UserModel.get({email: data.email})
        if (!isExist._id) {
            data.verifyCode = GeneralController.createCode()
            const user = await UserModel.create(data)
            if (user._id) {
                SmsController.send(data.cellPhone, 'Bienvenido DíaMarket tu código de verificación es ' + data.verifyCode)
                return user
            } else {
                return {error: 'Error al almacenar los datos', user}
            }

        } else {
            return {error: 'El usuario ya existe'}
        }
    }

    async validate(data) {
        const isExist = await UserModel.get({email: data.email, verifyCode: data.code})
        if (isExist._id) {
            const code = GeneralController.createCode()
            const update = await UserModel.update(isExist._id, {isActive: true, verifyCode: code})
            return update
        } else {
            return {error: 'El código de autencticación no es valido'}
        }
    }

    async updateVeryfycode(email) {
        const code = GeneralController.createCode()
        const isExist = await UserModel.get({email})
        if (isExist._id) {
            await EmailController.send(email, `Su codigo de verificacion es: ${code}`)
            return UserModel.update(isExist._id, {verifyCode: code})
        } else {
            return {error: 'No se ha actualizado el código de recuperación'}
        }
    }

    async getAdmin() {
        const rol = await UserModel.search({ rol: 'administrator' })
        let arrayAdmin = []
        for (const admins of rol) {
            let admin = {}
            admin._id = admins._id
            admin.name = admins.name
            arrayAdmin.push(admin)
        }
        return arrayAdmin
    }

    async updatePassword(_data) {

        const codeRandom = GeneralController.createCode()

        const data = await UserModel.get({verifyCode: _data.code, email: _data.email})
        if (data._id) {
            const encriptar = makePassword(_data.password)
            return await UserModel.update(data._id, {password: encriptar, verifyCode: codeRandom})
        } else {
            return {error: 'El código u correo no coincide'}
        }
    }

    async createOrder(data, _id) {
        const user = await UserModel.get({_id})

        const orders = []
        for(const order of user.order){
            orders.push(order)
        }
        orders.push(data.order)
        const update = UserModel.update(user._id,{order:orders})
        return update
    }

    async detail(data) {
        const user = await UserModel.get(data)
        if (user._id) {
            return user
        } else {
            return {error: " El usuario no existe"}
        }
    }
}

module.exports = new User()