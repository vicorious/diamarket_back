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
                return { estado: true, data: product, mensaje: null }
            } else {
                return { estado: false, data: [], mensaje: 'Error al almacenar los datos' }
            }
        } else {
            return { estado: false, data: [], mensaje: 'El producto ya existe' }
        }
    }

    async update(_id, data) {
        const isExist = await ProductModel.get({ _id })
        if (isExist._id) {
            const update = await ProductModel.update(isExist._id, data)
            return update
        } else {
            return { estado: false, data: [], mensaje: 'No existe el producto' }
        }
    }

    async detail(_id) {
        const isExist = await ProductModel.get({ _id })
        if (isExist._id) {
            return { estado: true, data: isExist, mensaje: null }
        } else {
            return { estado: false, data: [], mensaje: 'No existe el producto' }
        }
    }

    async detailAll(data) {
        const products = await ProductModel.search(data)
        return { estado: true, data: products, mensaje: null }
    }
}

module.exports = new User()