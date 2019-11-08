'use strict'

const UserModel = require('../models/userSchema')
const SmsController = require('../controllers/smsController')
const GeneralController = require('../controllers/generalController')
const EmailController = require('../controllers/emailController')
const makePassword = require('../utils/makePassword')
<<<<<<< HEAD
const ProductController = require('./productController')
const SupermarketController = require('./supermarketController')
=======
>>>>>>> 2345e418034efa2237f316e371e3eb75e0ada653
const uuid = require('node-uuid')

class User {
    async create(data) {
        const isExist = await UserModel.get({ email: data.email })
        if (!isExist._id) {
            data.verifyCode = await GeneralController.createCode()
            const user = await UserModel.create(data)
            if (user._id) {
                SmsController.send(data.cellPhone, 'Bienvenido DíaMarket tu código de verificación es ' + data.verifyCode)
                return { estado: true, data: user, mensaje: null }
            } else {
                return { estado: false, data: [], mensaje: 'Error al almacenar los datos' }
            }
        } else {
            return { estado: false, data: [], mensaje: 'El usuario ya se encuentra registrado en el sistema' }
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

        const data = await UserModel.get({ verifyCode: _data.code, email: _data.email })
        if (data._id) {
            const encriptar = makePassword(_data.password)
            return await UserModel.update(data._id, { password: encriptar, verifyCode: codeRandom })
        } else {
            return { error: 'El código u correo no coincide' }
        }
    }
    async update(id, data) {
        const isExist = await UserModel.get({ _id: id })
        if (data.password) {
            const encriptar = makePassword(data.password)
            data.password = encriptar
        }
        if (isExist._id) {
            console.log(id)
            const update = await UserModel.update(id, data)
            return { estado: true, data: [], mensaje: null }
        } else {
            return { estado: false, data: [], mensaje: 'El usuario no ha sido actualizado' }
        }
    }

    async createOrder(data, _id) {
<<<<<<< HEAD
        const date = new Date()
        data.order.dateCreate = date
        data.order.uid = uuid.v4()
=======
        data.dateCreate = Date.now()
        data.uid = uuid.v4()
>>>>>>> 2345e418034efa2237f316e371e3eb75e0ada653
        const user = await UserModel.get({ _id })
        const orders = []
        for (const order of user.order) {
            orders.push(order)
        }
        orders.push(data)
        const update = UserModel.update(user._id, { order: orders })
        return update
    }

    async createListproduct(data, _id) {
        const user = await UserModel.get({ _id })
        data.userList.uid = uuid.v4()
        const listArray = []
        for (const list of user.userList) {
            listArray.push(list)
        }
        listArray.push(data.userList)
        const update = UserModel.update(user._id, { userList: listArray })
        return update
    }

    async getUserlist(_id) {
        const isExist = await UserModel.get({ _id })
        if (isExist) {
            let positionProduct = 0
            let positionList = 0
            let listArray = []
            let productArray = []
            for (const lists of isExist.userList) {
                for (const productId of lists.products) {
                    const product = await ProductController.detail({ _id: productId })
                    productArray.push(product)
                    positionProduct++
                }
                listArray.push({ name: lists.name, superMarket: await SupermarketController.detail({ _id: lists.superMarket }), product: productArray })
                productArray = []
                positionList++
            }
            return listArray
        } else {
            return { error: 'No se ha podido obtener la lista' }
        }
    }

    async conuntOrder() {
        const users = await UserModel.search()
        let count = 0
        for (const user of users) {
            for (const orders of user.order) {
                count++
            }
        }
        console.log(count);
    }

    async detail(data) {
        const user = await UserModel.get(data)
        if (user._id) {
            return { estado: true, data: user, mensaje: null }
        } else {
            return { estado: false, data: [], mensaje: "El usuario no se encuentra registrado" }
        }
    }

    async detailAll(data) {
        const user = await UserModel.search(data)
        if (user.length > 0) {
            return { estado: true, data: user, mensaje: null }
        } else {
            return { estado: false, data: [], mensaje: "No se encuentran datos" }
        }
    }

    async countGen() {
        let countOrder = 0
        const userCount = await UserModel.count({ rol: 'client' })
        const data = await UserModel.search({ rol: 'client' })
        for (const user of data) {
            for (const order of user.order) {
                countOrder++
            }
        }
        return { countOrder, userCount }
    }
}

module.exports = new User()