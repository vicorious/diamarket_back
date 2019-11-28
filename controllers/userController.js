'use strict'

const UserModel = require('../models/userSchema')
const SuperMarketModel = require('../models/supermarketSchema')
const SmsController = require('../controllers/smsController')
const GeneralController = require('../controllers/generalController')
const EmailController = require('../controllers/emailController')
const makePassword = require('../utils/makePassword')
const ProductController = require('./productController')
const SupermarketController = require('./supermarketController')
const uuid = require('node-uuid')
const moment = require('moment')
const mongoose = require('mongoose')

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
            const code = await GeneralController.createCode()
            const update = await UserModel.update(isExist._id, { isActive: true, verifyCode: code })
            return update
        } else {
            return { estado: false, data: [], mensaje: 'El código de autencticación no es valido' }
        }
    }

    async updateVeryfycode(email) {
        const code = await GeneralController.createCode()
        const isExist = await UserModel.get({ email })
        if (isExist._id) {
            await EmailController.send(email, `Su codigo de verificacion es: ${code}`)
            const update = await UserModel.update(isExist._id, { verifyCode: code })
            return update
        } else {
            return { estado: false, data: [], mensaje: 'No se ha actualizado el código de recuperación' }
        }
    }

    async getAdmin() {
        const rol = await UserModel.search({ rol: 'administrator' })
        let arrayAdmin = []
        let arraySupermarket = []
        for (const admins of rol) {
            let supermarketObject = {}
            const supermarkets = await SupermarketController.detailAll({ idAdmin: admins._id })

            for (const supermarket of supermarkets.data) {
                supermarketObject.name = supermarket.name
                supermarketObject.status = supermarket.status
                supermarketObject.images = supermarket.images
                supermarketObject.schedules = supermarket.schedules
                supermarketObject.dateCreate = supermarket.dateCreate
                supermarketObject._id = supermarket._id
                supermarketObject.address = supermarket.address
                supermarketObject.location = supermarket.location
                supermarketObject.neigborhood = supermarket.neigborhood
                supermarketObject.locality = supermarket.locality
                supermarketObject.email = supermarket.email
                supermarketObject.logo = supermarket.logo
                supermarketObject.calification = supermarket.calification
                arraySupermarket.push(supermarketObject)
            }

            let admin = {}
            admin._id = admins._id
            admin.supermarket = arraySupermarket
            admin.name = admins.name
            admin.rol = admins.rol
            admin.directions = admins.directions
            admin.identification = admins.identification
            admin.email = admins.email
            arrayAdmin.push(admin)
        }
        if(arrayAdmin.length > 0){
            return { estado: true, data: arrayAdmin, mensaje: null, code: 200 }
        }else {
            return { estado: true, data: [], mensaje: 'No hay datos', code: 200 }
        }
    }

    async updatePassword(data) {
        const codeRandom = await GeneralController.createCode()
        const user = await UserModel.get({ verifyCode: data.code, email: data.email })
        if (user._id) {
            const encriptar = await makePassword(data.password)
            const update = await UserModel.update(user._id, { password: encriptar, verifyCode: codeRandom })
            return update
        } else {
            return { estado: false, data: [], mensaje: 'El código u correo no coincide' }
        }
    }

    async update(id, data) {
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

    async createOrder(data, _id) {
        const date = new Date()
        let products = []
        let promos = []
        for (const product of data.products) {
            let idProduct = mongoose.Types.ObjectId(product)
            products.push(idProduct)
        }
        for (const promo of data.promos) {
            let idPromo = mongoose.Types.ObjectId(promo)
            promos.push(idPromo)
        }
        let idMarket = mongoose.Types.ObjectId(data.idSuperMarket)
        data.idSuperMarket = idMarket
        data.dateCreate = date
        data.products = products
        data.promos = promos
        data.uid = uuid.v4()
        const user = await UserModel.get({ _id })
        if(user.order.length > 0){
            const update = await UserModel.update(user._id, {$push: {order : data }})
            return update
        }else {
            const update = await UserModel.update(user._id, { order: data })
            return update
        }
    }

    async createListproduct(data, _id) {
        const user = await UserModel.get({ _id })
        let idMarket = mongoose.Types.ObjectId(data.superMarket)
        let products = []
        for (const product of data.products) {
            let idProduct = mongoose.Types.ObjectId(product)
            products.push(idProduct)
        }
        data.superMarket = idMarket
        data.products = products
        data.uid = uuid.v4()
        if(user.userList.length > 0) {
            const update = UserModel.update(user._id, {$push: {userList: data}})
            return update
        }else {
            const update = UserModel.update(user._id, { userList: data })
            return update
        }
    }

    async getUserlist(_id) {
        const isExist = await UserModel.get({ _id })
        if (isExist) {
            return { estado: true, data: isExist.userList, mensaje: null }
        } else {
            return { estado: false, data: [], mensaje: 'Error al obtener la lista' }
        }
    }

    async conuntOrder(meses) {
        let mes = meses - 1
        const date = new Date()
        const currentMonth = date.getMonth() + 1
        const users = await UserModel.search({ rol: "client" })
        const arrayCount = []
        for (const user of users) {
            for (const orders of user.order) {
                let count = 1
                const date = new Date(orders.dateCreate);
                const newMonth = date.getMonth() + 1;
                for (let i = mes; i >= 0; i--) {
                    const resta = moment().subtract(i, 'months').format('M')
                    const restanew = parseInt(resta)
                    if (newMonth === restanew) {
                        if (arrayCount.length > 0) {
                            let integer = 0
                            for (let dataArray of arrayCount) {
                                if (dataArray.mes === newMonth) {
                                    count = arrayCount[integer].total + 1
                                    arrayCount[integer] = 0
                                }
                                integer++
                            }
                        }
                        arrayCount.push({ mes: newMonth, total: count })
                        count++
                    }
                }
            }
        }
        let newArray = []
        for (const data of arrayCount) {
            if (data != 0) {
                newArray.push(data)
            }
        }
        return { estado: true, data: newArray, mensaje: null }
    }

    async createDirection(_id, data) {
        const isExist = await UserModel.get({ _id })
        data.uid = uuid.v4()
        if (isExist) {
            const directionArray = []
            for (const directions of isExist.directions) {
                directionArray.push(directions)
            }
            directionArray.push(data)
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
        UserModel.fields= 'name directions cellPhone email userList supermarketFavorite imageProfile'
        const user = await UserModel.get(data)
        if (user._id) {
            return { estado: true, data: user, mensaje: null }
        } else {
            return { estado: false, data: [], mensaje: 'El usuario no se encuentra registrado' }
        }
    }

    async all(data) {
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
        UserModel.fields = 'order'
        const orders = await UserModel.search({ rol: 'client'})
        if(orders.length > 0) {
            return{estado: true, data: orders, mensaje: null}
        }else {
            return{estado: false, data: [], mensaje: 'No existen ordenes'}
        }
    }
}

module.exports = new User()