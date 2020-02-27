'use strict'
const ProductModel = require('../models/productSchema')
const AvailabilityModel = require('../models/availabilitySchema')
const SuperMarketModel = require('../models/supermarketSchema')

class Product {
  async create (data) {
    const isExist = await ProductModel.get({ name: data.name })
    if (!isExist._id) {
      const product = await ProductModel.create(data)
      if (product._id) {
        return { estado: true, data: product, mensaje: null }
      } else {
        return { estado: false, data: [], mensaje: 'Error al almacencar datos' }
      }
    } else {
      return { estado: false, data: [], mensaje: 'Ya existe el producto' }
    }
  }

  async update (id, data) {
    const isExist = await ProductModel.get(id)
    if (isExist._id) {
      const update = await ProductModel.update(id, data)
      return update
    } else {
      return { estado: false, data: [], mensaje: 'No existe el producto' }
    }
  }

  async detail (id) {
    const isExist = await ProductModel.get(id)
    if (isExist._id) {
      return { estado: true, data: isExist, mensaje: null }
    } else {
      return { estado: false, data: [], mensaje: 'No existe el producto' }
    }
  }

  async all (data) {
    const s = await ProductModel.search({})
    for (const object of s) {
      const p = await ProductModel.update(object._id, {offert: 0})
    }
    const products = []
    const availability = await AvailabilityModel.search(data)
    for (const object of availability) {
      const product = await ProductModel.get({ _id: object.idProduct })
      object._doc.idProduct = product
      products.push(object)
    }
    return { estado: true, data: products, mensaje: null }
  }

  async productsSuperMarkets (idSupermarket) {
    const products = await AvailabilityModel.search({ idSupermarket, isActive: true })
    if (products.length > 0) {
      return { estado: true, data: products, mensaje: null }
    } else {
      return { estado: false, data: [], mensaje: 'Este supermercado no tiene productos' }
    }
  }

  async productsForCategory (data) {
    const products = await ProductModel.search({ category: data.category })
    const arrayProducts = []
    for (const product of products) {
      const productsCategory = await AvailabilityModel.get({ idSupermarket: data.idSupermarket, idProduct: product._id, isActive: true })
      if (productsCategory._id) {
        arrayProducts.push(productsCategory)
      }
    }
    if (arrayProducts.length > 0) {
      return { estado: true, data: arrayProducts, mensaje: null }
    } else {
      return { estado: false, data: [], mensaje: 'Esta categoria no tiene productos' }
    }
  }

  async productsForName (data) {
    const products = await ProductModel.search({ name: data.name })
    const arrayProducts = []
    for (const product of products) {
      const productsName = await AvailabilityModel.get({ idSupermarket: data.idSupermarket, idProduct: product._id, isActive: true })
      if (productsName._id) {
        arrayProducts.push(productsName)
      }
    }
    if (arrayProducts.length > 0) {
      return { estado: true, data: arrayProducts, mensaje: null }
    } else {
      return { estado: false, data: [], mensaje: 'No existe productos cor este nombre' }
    }
  }

  async forSuperMarket (_id) {
    const superMarket = await SuperMarketModel.get({ idAdmin: _id })
    const products = AvailabilityModel.search({ idSupermarket: superMarket._id })
    if (products.length > 0) {
      return { estado: true, data: products, mensaje: null }
    } else {
      return { estado: false, data: [], mensaje: 'No existen productos para este supermercado' }
    }
  }

//   async categoryData () {
//     try {
//       const categorys = await categoryModel.search({})
//       let count = 0
//       for (let r = 0; r <= 20; r++) {
//         for (const category of categorys) {
//           count++
//           const random = await generalController.createCode()
//           const obj = {
//             image: ['https://jumbocolombiafood.vteximg.com.br/arquivos/ids/3323070-750-750/7702129075275-1.jpg?v=636670897146530000'],
//             idPos: random,
//             name: `Jamón${count}`,
//             description: 'Descripción de el producto',
//             category: category.name,
//             defaultprice: 12300
//           }
//           const create = await ProductModel.create(obj)
//           console.log(create)
//         }
//       }
//       return 'Successful!'
//     } catch (error) {
//       console.log(error)
//       return 'Failure!'
//     }
//   }
}

module.exports = new Product()
