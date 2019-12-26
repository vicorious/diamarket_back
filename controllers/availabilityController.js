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

    async update(_id, data) {
        const isExist = await availabilityModel.get({ _id })
        if (isExist._id) {
            const update = await availabilityModel.update(isExist._id, data)
            return update
        } else {
            return { estado: false, data: [], mensaje: 'No existe esta disponibilidad' }
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

    async createData(){
            const products = await productModel.search({})
            let arrayProductsID = []
            let arrayProductsName = []
            for(const obj of products){
                let object = {
                    idSupermarket: "5dc1954c9050073b6082ecbe",
                    idProduct: obj._id,
                    quantity: 200,
                    price: 72600
                }
                const create = await availabilityModel.create(object)
                arrayProductsID.push(obj._id)
                arrayProductsName.push(obj.name)
            }
            products.map(async function(obj){
                let object1 = {
                    idSupermarket: "5debcfe2f04f4f8ce6bd818f",
                    idProduct: obj._id,
                    quantity: 400,
                    price: 57250
                }
                const create = await availabilityModel.create(object1)
            })
            for (let r = 0; r <= 20; r++) {
                let name = arrayProductsName[r]
                let name1 = arrayProductsName[r + 1]
                let id = arrayProductsID[r]
                let id1 = arrayProductsID[r + 1]
                let obj = {                    
                    products: [id, id1],
                    image: ["https://helpmi-s3.s3.amazonaws.com/b3abec02-2670-436e-ae68-3d45a2d629ca/11e43443-620c-4b5b-8ba5-e37e8d97b0d8.jpg"],
                    name: `Promoción de ${name} y ${name1}!`,
                    supermarket: "5dc1954c9050073b6082ecbe",
                    value: 132000
                }
                
                const create = pro.create(obj)
                
            }
            for (let r = 0; r <= 20; r++) {
                let name = arrayProductsName[r]
                let name1 = arrayProductsName[r + 1]
                let id = arrayProductsID[r]
                let id1 = arrayProductsID[r + 1]
                let obj = {                    
                    products: [id, id1],
                    image: ["https://helpmi-s3.s3.amazonaws.com/b3abec02-2670-436e-ae68-3d45a2d629ca/11e43443-620c-4b5b-8ba5-e37e8d97b0d8.jpg"],
                    name: `Promoción de ${name} y ${name1}!`,
                    supermarket: "5debcfe2f04f4f8ce6bd818f",
                    value: 132000
                }
                const create = pro.create(obj)
            }
            return "Successful!!!"
    }
}

module.exports = new Availability()