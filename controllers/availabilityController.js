const availabilityModel = require('../models/availabilitySchema')
const productModel = require('../models/productSchema')
// const cate = require('../models/categorySchema')
// const pro = require('../models/promotionSchema')

class Availability {
  async create (data) {
    const isExist = await availabilityModel.get({ idSupermarket: data.idSupermarket })
    if (isExist) {
      const create = await availabilityModel.create(data)
      return { estado: true, data: create, mensaje: null }
    } else {
      return { estado: false, data: [], mensaje: 'Error en la creación' }
    }
  }

  async update (id, data) {
    const isExist = await availabilityModel.get(id)
    if (isExist._id) {
      const update = await availabilityModel.update(isExist._id, data)
      return update
    } else {
      return { estado: false, data: [], mensaje: 'No existe esta disponibilidad' }
    }
  }

  async productsSuperMarkets (idSupermarket) {
    const products = await availabilityModel.search({ idSupermarket, isActive: true })
    if (products.length > 0) {
      return { estado: true, data: products, mensaje: null }
    } else {
      return { estado: false, data: [], mensaje: 'Este supermercado no tiene productos' }
    }
  }

  async productsForCategory (data) {
    const products = await productModel.search({ category: data.category })
    const arrayProducts = []
    for (const detail of products) {
      const productsCategory = await availabilityModel.get({ idSupermarket: data.idSupermarket, idProduct: detail._id, isActive: true })
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
    const products = await productModel.search({ name: data.name })
    const arrayProducts = []
    for (const detail of products) {
      const productsName = await availabilityModel.get({ idSupermarket: data.idSupermarket, idProduct: detail._id, isActive: true })
      if (productsName._id) {
        arrayProducts.push(productsName)
      }
    }
    if (arrayProducts.length > 0) {
      return { estado: true, data: arrayProducts, mensaje: null }
    } else {
      return { estado: true, data: arrayProducts, mensaje: 'No existe productos por este nombre' }
    }
  }

  //   async availibilityData () {
  //     try {
  //       const products = await productModel.search({})
  //       for (const product of products) {
  //         const obj = {
  //           idSupermarket: '5dc195179050073b6082ecbd',
  //           idProduct: product._id,
  //           quantity: 457,
  //           price: 32850
  //         }
  //         const create = await availabilityModel.create(obj)
  //       }
  //       for (const product of products) {
  //         const obj = {
  //           idSupermarket: '5dc1954c9050073b6082ecbe',
  //           idProduct: product._id,
  //           quantity: 568,
  //           price: 32850
  //         }
  //         const create = await availabilityModel.create(obj)
  //       }
  //       for (const product of products) {
  //         const obj = {
  //           idSupermarket: '5debcfe2f04f4f8ce6bd818f',
  //           idProduct: product._id,
  //           quantity: 712,
  //           price: 32850
  //         }
  //         const create = await availabilityModel.create(obj)
  //       }
  //       return 'successfull!'
  //     } catch (error) {
  //       return 'failure!'
  //       console.log(error)
  //     }
  //   }
}

module.exports = new Availability()
