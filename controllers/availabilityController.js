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

    async productsSuperMarkets(id){
        const products = await availabilityModel.search({idSupermarket: id})
        if(products.length > 0){
            return { estado: true, data: products, mensaje: null }
        }else {
            return { estado: false, data: [], mensaje: "Este supermercado no tiene productos" }
        }
    }

    async productsForCategory(data){
        const products = await productModel.search({category: data.category})
        let arrayProducts = []
        for (const detail of products) {
            const productsCategory = await availabilityModel.get({ idSupermarket: data.idSupermarket, idProduct: detail._id })
            if (productsCategory._id) {
                arrayProducts.push(productsCategory)
            }
        }
        if(arrayProducts.length > 0) {
            return { estado: true, data: arrayProducts, mensaje: null }
        }else{
            return { estado: false, data: [], mensaje: "Esta categoria no tiene productos" }
        }
    }

    async productsForName(data){
        const products = await productModel.search({ name: data.name })
        let arrayProducts = []
        for (const detail of products) {
            const productsName = await availabilityModel.get({ idSupermarket: data.idSupermarket, idProduct: detail._id })
            if (productsName._id) {
                arrayProducts.push(productsName)
            }
        }
        if(arrayProducts.length > 0){
            return { estado: true, data: arrayProducts, mensaje: null }
        }else {
            return { estado: true, data: arrayProducts, mensaje: "No existe productos por este nombre" }
        }
                
    }
}

module.exports = new Availability()