const availabilityModel = require('../models/availabilitySchema')
const productModel = require('../models/productSchema')

class Availability {
    async create(data) {
        const isExist = await availabilityModel.get({ idSupermarket: data.idSupermarket })
        if (isExist) {
            const create = await availabilityModel.create(data)
            return { estado: true, data: create, mensaje: null }
        } else {
            return { estado: false, data: [], mensaje: 'Error en la creación' }
        }
    }

    async detail(data) {
        const isExist = await availabilityModel.get({ idSupermarket: data.idSupermarket })
        if (isExist) {
            if (!data.category && !data.name) {
                const detail = await availabilityModel.search({ idSupermarket: data.idSupermarket })
                return { estado: true, data: detail, mensaje: null }
            } else if (data.category && !data.name) {
                const detail = await productModel.search({ category: data.category })
                let arrayProducts = []
                for (const products of detail) {
                    const productsCategory = await availabilityModel.get({ idSupermarket: data.idSupermarket, idProduct: products._id })
                    if (productsCategory._id) {
                        arrayProducts.push(productsCategory)
                    }
                }
                return { estado: true, data: arrayProducts, mensaje: null }
            } else if (!data.category && data.name) {
                const detail = await productModel.search({ name: data.name })
                let arrayProducts = []
                for (const products of detail) {
                    const productsName = await availabilityModel.get({ idSupermarket: data.idSupermarket, idProduct: products._id })
                    if (productsName._id) {
                        arrayProducts.push(productsName)
                    }
                }
                return { estado: true, data: arrayProducts, mensaje: null }
            } else {
                return { estado: false, data: [], mensaje: 'Error al obtener producto' }
            }
        } else {
            return { estado: false, data: [], mensaje: 'Error al obtener producto' }
        }
    }
}

module.exports = new Availability()