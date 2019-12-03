const availabilityModel = require('../models/availabilitySchema')
const productModel = require('../models/productSchema')
const cate = require('../models/categorySchema')
const pro = require('../models/promotionSchema')

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

    async productsSuperMarkets(id) {
        const products = await availabilityModel.search({ idSupermarket: id, isActive: true })
        if (products.length > 0) {
            return { estado: true, data: products, mensaje: null }
        } else {
            return { estado: false, data: [], mensaje: "Este supermercado no tiene productos" }
        }
    }

    async inactivate(_id) {
        const isExist = await availabilityModel.get({ _id })
        if (isExist._id) {
            const inactivate = await availabilityModel.update(isExist._id, { isActive: false })
            return inactivate
        } else {
            return { estado: false, data: [], mensaje: 'No se ha desctivado el producto' }
        }
    }

    async productsForCategory(data) {
        const products = await productModel.search({ category: data.category })
        let arrayProducts = []
        for (const detail of products) {
            const productsCategory = await availabilityModel.get({ idSupermarket: data.idSupermarket, idProduct: detail._id, isActive: true })
            if (productsCategory._id) {
                arrayProducts.push(productsCategory)
            }
        }
        if (arrayProducts.length > 0) {
            return { estado: true, data: arrayProducts, mensaje: null }
        } else {
            return { estado: false, data: [], mensaje: "Esta categoria no tiene productos" }
        }
    }

    async productsForName(data) {
        const products = await productModel.search({ name: data.name })
        let arrayProducts = []
        for (const detail of products) {
            const productsName = await availabilityModel.get({ idSupermarket: data.idSupermarket, idProduct: detail._id, isActive: true })
            if (productsName._id) {
                arrayProducts.push(productsName)
            }
        }
        if (arrayProducts.length > 0) {
            return { estado: true, data: arrayProducts, mensaje: null }
        } else  {
            return { estado: true, data: arrayProducts, mensaje: "No existe productos por este nombre" }
        }

    }

    async incativeFullData() {
        const availabilitys = await availabilityModel.search({})
        for (const ava of availabilitys) {
            ava.isActive = true
            await availabilityModel.update(ava._id, ava)
        }
        const categprys = await cate.search({})
        categprys.map(async function(obj) {
            obj.isActive = true
            await cate.update(obj._id, obj)
        })
        const pr = await pro.search({})
        pr.forEach(async(obj) => {
            obj.isActive = true
            await pro.update(obj._id, obj)
        });
    }
}

module.exports = new Availability()