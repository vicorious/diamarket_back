'use strict'
const ProductModel = require('../models/productSchema')
const generalController = require('../controllers/generalController')
const availabilityController = require('../controllers/availabilityController')
const promotionController = require('../controllers/promotionController')
class User {

    async create(data) {
        const isExist = await ProductModel.get({ idPos: data.idPos })
        if (!isExist._id) {
            data.image = data.images
            delete data.images
            const product = await ProductModel.create(data)
            if (product._id) {
                return { estado: true, data: product , mensaje: null }
            } else {
                return { estado: false, data: [], mensaje: 'Error al almacenar los datos' }
            }
        } else {
            return { estado: false, data: [], mensaje: 'El producto ya existe' }
        }
    }

    async detail(data) {
        const isExist = await ProductModel.get(data)
        return { estado: true, data: isExist, mensaje: null }
    }
    async detailAll(data) {
        const products = await ProductModel.search(data)
        return { estado: true, data: products, mensaje: null }
    }
}

module.exports = new User()