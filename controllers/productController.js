'use strict'
const ProductModel = require('../models/productSchema')
const generalController = require('../controllers/generalController')
const availabilityController = require('../controllers/availabilityController')
const promotionController = require('../controllers/promotionController')
class User {
    async create(data) {
        const isExist = await ProductModel.get({ idPos: data.idPos })
        if (!isExist._id) {
            const product = await ProductModel.create(data)
            if (product._id) {
                return { estado: true, data: [], mensaje: null }
            } else {
                return { estado: false, data: [], mensaje: 'Error al almacenar los datos' }
            }

        } else {
            return { estado: false, data: [], mensaje: 'El producto ya existe' }
        }
    }

    async createData() {
        let arrayProducts = ['Leche', 'Arroz', 'Maizena', 'Café soluble', 'Frijol', 'Sopa', 'Huevos', 'Consomate', 'Harina de trigo', 'Azúcar', 'Aceite', 'Manteca vegetal', 'Papa blanca', 'Jitomate', 'Pierna y muslo de pollo', 'Chile verde', 'Cebollas', 'Detergente', 'Jabón de baño', 'Papel de baño', 'Cloro', 'Shampoo', 'Naranjas', 'Plátanos', 'Limones', 'Tortillas de maíz', 'Pasta de dientes', 'Jamón', 'Carne molida', 'Cereal', 'Manzanas', 'Aguacate', 'Huevos', 'Papa', 'Utiles escolares', 'Jabón líquido p/trastes', 'Spaguetti', 'Chocolate', 'Fabuloso', 'Lentejas', 'Café', 'Brillaollas', 'Ambientador', 'Yogurt descremado', 'Pan', 'Desodorante', 'Tampones', 'Toallas higiénicas', 'Suavizante para la ropa', 'Dulce de leche tradicional']
        let arrayCategorys = ['LECHES LIQUIDAS', 'ALIMENTOS', 'VIVERES Y ABARROTES', 'VIVERES Y ABARROTES', 'ALIMENTOS', 'ALIMENTOS', 'ALIMENTOS', 'VIVERES Y ABARROTES', 'VIVERES Y ABARROTES', 'VIVERES Y ABARROTES', 'VIVERES Y ABARROTES', 'VIVERES Y ABARROTES', 'FRUVER', 'FRUVER', 'CARNES', 'FRUVER', 'FRUVER', 'ASEO', 'ASEO', 'ASEO HOGAR', 'ASEO HOGAR', 'ASEO', 'FRUVER', 'FRUVER', 'FRUVER', 'VIVERES Y ABARROTES', 'ASEO PERSONAL', 'CARNES', 'CARNES', 'ALIMENTOS', 'FRUVER', 'FRUVER', 'ALIMENTOS', 'FRUVER', 'Utiles escolares', 'ASEO', 'VIVERES Y ABARROTES', 'VIVERES Y ABARROTES', 'ASEO HOGAR', 'VIVERES Y ABARROTES', 'VIVERES Y ABARROTES', 'ASEO HOGAR', 'ASEO HOGAR', 'ALIMENTOS', 'ALIMENTOS', 'ASEO PERSONAL', 'ASEO PERSONAL', 'ASEO PERSONAL', 'ASEO HOGAR', 'VIVERES Y ABARROTES']
        let arrayProd = []
        for (let i = 0; i <= 49; i++) {
            let random = await generalController.createRandomid()
            let random1 = await generalController.createRandomquantity()
            const obj = {
                image: ["https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRboqluVJCwYkst2vdSyHoETJosgD-J-igSAKNaqBdjU8m88Ki9NxqQZg2YjtYnUYz84RD2GUDebqHeY82aYeLjTvLCtWZNukMhIfgLrE3guyKUOhw3BfvGJA&usqp=CAc"],
                idPos: random,
                name: arrayProducts[i],
                description: "Descripción del producto",
                category: arrayCategorys[i],
                defaultprice: "12000"
            }
            const create = await ProductModel.create(obj)
            const data = {
                idSupermarket: "5dc195179050073b6082ecbd",
                idProduct: create._id,
                quantity: random1,
                price: "12000"
            }
            const createAvailability = await availabilityController.create(data)
            arrayProd.push(create)
        }
        for (let u = 0; u <= 20; u++) {
            let arra = arrayProducts[u]
            let arra1 = arrayProducts[u + 1]
            let arrapro1 = arrayProd[u]
            let arrapro2 = arrayProd[u + 1]
            console.log(arra);
            const data1 = {
                name: `Promociones para ${arra} y ${arra1}`,
                supermarket: "5dc195179050073b6082ecbd",
                products: [arrapro1, arrapro2],
                value: "20000",
                image: "https://e1ncrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRboqluVJCwYkst2vdSyHoETJosgD-J-igSAKNaqBdjU8m88Ki9NxqQZg2YjtYnUYz84RD2GUDebqHeY82aYeLjTvLCtWZNukMhIfgLrE3guyKUOhw3BfvGJA&usqp=CAc"
            }
            const createPromotion = await promotionController.create(data1)
                // console.log(createPromotion);
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