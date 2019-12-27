'use strict'
const ProductModel = require('../models/productSchema')
const generalController = require('../controllers/generalController')
const availabilityController = require('../controllers/availabilityController')
const promotionController = require('../controllers/promotionController')
const categoryModel = require('../models/categorySchema')
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

    async categoryData(){
        try {
            const categorys = await categoryModel.search({})
            let count = 0
            for (let r = 0; r <= 20; r++) {
                for (const category of categorys) {
                    count++
                    let random = await generalController.createCode()
                    let obj = {
                        image: ["https://jumbocolombiafood.vteximg.com.br/arquivos/ids/3323070-750-750/7702129075275-1.jpg?v=636670897146530000"],
                        idPos: random,
                        name: `Jamón${count}`,
                        description: "Descripción de el producto",
                        category: category.name,
                        defaultprice: 12300 
                    }
                    const create = await ProductModel.create(obj)
                }
            }
            return "Successful!"
        } catch (error) {
            console.log(error)
            return "Failure!"
        }
    }
}

module.exports = new User()