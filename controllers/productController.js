'use strict'
const ProductModel = require('../models/productSchema')
class User {
    async create(data) {
        const isExist = await ProductModel.get({ idPos: data.idPos })
        if (!isExist._id) {
            const product = await ProductModel.create(data)
            if (product._id) {
                return product
            } else {
                return { error: 'Error al almacenar los datos', product }
            }

        } else {
            return { error: 'El producto ya existe' }
        }
    }
    async detail() {
        const isExist = await ProductModel.get({})
    }
    async detailAll(data) {
        const products = ProductModel.search(data)
        return products
    }
}

module.exports = new User()