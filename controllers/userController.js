'use strict'

const UserModel = require('../models/userSchema')
const SmsController = require('../controllers/smsController')
const GeneralController = require('../controllers/generalController')
const EmailController = require('../controllers/emailController')
const makePassword = require('../utils/makePassword')
const ProductController = require('./productController')
const SupermarketController = require('./supermarketController')
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
            return { estado: true, data: [], mensaje: null }
        } else {
            return { estado: false, data: [], mensaje: 'El código de autencticación no es valido' }
        }
    }

    async updateVeryfycode(email) {
        const code = GeneralController.createCode()
        const isExist = await UserModel.get({ email })
        if (isExist._id) {
            await EmailController.send(email, `Su codigo de verificacion es: ${code}`)
            await UserModel.update(isExist._id, { verifyCode: code })
            return { estado: true, data: [], mensaje: null }
        } else {
            return { estado: false, data: [], mensaje: 'No se ha actualizado el código de recuperación' }
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
        return { estado: true, data: arrayAdmin, mensaje: null }
    }

    async updatePassword(_data) {
        const codeRandom = GeneralController.createCode()
        const data = await UserModel.get({ verifyCode: _data.code, email: _data.email })
        if (data._id) {
            const encriptar = makePassword(_data.password)
            const update = await UserModel.update(data._id, { password: encriptar, verifyCode: codeRandom })
            return { estado: true, data: [], mensaje: null }
        } else {
            return { estado: false, data: [], mensaje: 'El código u correo no coincide' }
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

        const date = new Date()
        data.dateCreate = date
        data.uid = uuid.v4()

        const user = await UserModel.get({ _id })
        const orders = []
        for (const order of user.order) {
            orders.push(order)
        }
        orders.push(data)
        const update = UserModel.update(user._id, { order: orders })
        return { estado: true, data: [], mensaje: null }
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
        return { estado: true, data: [], mensaje: null }
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
            return { estado: true, data: listArray, mensaje: null }
        } else {
            return { estado: false, data: [], mensaje: 'Error al obtener la lista' }
        }
    }

    async conuntOrder() {
        const date = new Date()
        const currentMonth = date.getMonth() + 1
        const users = await UserModel.search()
        let count = 0
        for (const user of users) {
            for (const orders of user.order) {
                const month = date.getMonth(orders.dateCreate) + 1
            }
        }
        console.log(count);
    }

    async createDirection(_id, data) {
        const isExist = await UserModel.get({ _id })
        data.directions.uid = uuid.v4()
        if (isExist) {
            const directionArray = []
            for (const directions of isExist.directions) {
                directionArray.push(directions)
            }
            directionArray.push(data.directions)
            const update = await UserModel.update(_id, { directions: directionArray })
            return { estado: true, data: [], mensaje: null }
        } else {
            return { estado: false, data: [], mensaje: 'La dirección no se ha creado' }
        }
    }

    async detail(data) {
        const user = await UserModel.get(data)
        if (user._id) {
            return { estado: true, data: user, mensaje: null }
        } else {
            return { estado: false, data: [], mensaje: 'El usuario no se encuentra registrado' }
        }
    }

    async detailClient(data) {
        const user = await UserModel.get(data)
        if (user._id) {
            let userObjc = {
                name: user.name,
                directions: user.directions,
                cellPhone: user.cellPhone,
                email: user.email,
                userList: user.userList
            }
            return { estado: true, data: userObjc, mensaje: null }
        } else {
            return { estado: false, data: [], mensaje: 'El usuario no se encuentra registrado' }
        }
    }

    async detailAll(data) {
        const user = await UserModel.search(data)
        if (user.length > 0) {
            return { estado: true, data: user, mensaje: null }
        } else {
            return { estado: false, data: [], mensaje: 'No se encuentran datos' }
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

    async listOrder() {
        const data = await UserModel.search({ rol: 'client' })
        const orders = []
        for (const user of data) {
            for (const order of user.order) {
                order.idSupermarket = await SupermarketController.detail({ _id: order.idSupermarket })
                let products = []
                for (const product of order.products) {
                    const productData = await ProductController.detail({ _id: product })
                    products.push(productData)
                }
                order.products = products
                orders.push(order)
            }
        }
        return { estado: true, data: orders, mensaje: null }
    }
}

module.exports = new User()