'use strict'
const ProductModel = require('../models/productSchema')
const AvailabilityModel = require('../models/availabilitySchema')
const SuperMarketModel = require('../models/supermarketSchema')
const CategoryModel = require('../models/categorySchema')
const MsSql = require('mssql')
const { DATABASES } = require('../config/settings')

class Product {
  async createPost() {
    const products = await MsSql.query`
    SELECT items.f120_rowid as 'id_product', items.f120_descripcion as 'name_product', items.f120_descripcion_corta
    FROM dbo.t120_mc_items as items
    WHERE items.f120_id_cia = 6 AND items.f120_ind_venta = 1;
  `
    if (products.recordset.length > 0) {
      for (const object of products.recordset) {
        const data = {
          idPos: object.id_product,
          name: object.name_product,
          description: object.f120_descripcion_corta
        }
        await ProductModel.create(data)
      }
      return products
    }
  }

  async create(data) {
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

  async update(id, data) {
    const isExist = await ProductModel.get(id)
    if (isExist._id) {
      data.image = data.images
      delete data.images
      const update = await ProductModel.update(id, data)
      return update
    } else {
      return { estado: false, data: [], mensaje: 'No existe el producto' }
    }
  }

  async detail(id) {
    const isExist = await ProductModel.get(id)
    if (isExist._id) {
      return { estado: true, data: isExist, mensaje: null }
    } else {
      return { estado: false, data: [], mensaje: 'No existe el producto' }
    }
  }

  async all(data, quantity, page) {
    AvailabilityModel.perPage = parseInt(quantity)
    const products = []
    const availability = await AvailabilityModel.searchByPage(data, page)
    const countAvailability = await AvailabilityModel.count({})
    for (const object of availability) {
      const product = await ProductModel.get({ _id: object.idProduct })
      object._doc.idProduct = product
      products.push(object)
    }
    if (products.length > 0) {
      return { estado: true, data: { page: page, quantity: quantity, total: countAvailability, items: products }, mensaje: null }
    } else {
      return { estado: true, data: [], mensaje: 'No hay productos' }
    }
    
  }

  async productsSuperMarkets(idSupermarket, initQuantity, finishQuantity) {
    const products = await AvailabilityModel.searchByPageMobile({ idSupermarket, isActive: true }, initQuantity, finishQuantity)
    if (products.length > 0) {
      return { estado: true, data: products, mensaje: null }
    } else {
      return { estado: false, data: [], mensaje: 'Este supermercado no tiene productos' }
    }
  }

  async productsForCategory(data, quantity, page) {
    ProductModel.perPage = parseInt(quantity)
    const products = await ProductModel.searchByPage({ category: data.category }, page)
    const countAvailability = await AvailabilityModel.count({})
    const arrayProducts = []
    for (const product of products) {
      const productsCategory = await AvailabilityModel.get({ idSupermarket: data.idSupermarket, idProduct: product._id, isActive: true })
      if (productsCategory._id) {
        arrayProducts.push(productsCategory)
      }
    }
    if (arrayProducts.length > 0) {
      return { estado: true, data: { page: page, quantity: quantity, total: countAvailability, items: arrayProducts }, mensaje: null }
    } else {
      return { estado: false, data: [], mensaje: 'Esta categoria no tiene productos' }
    }
  }
  
  async productsForCategoryApp (data, initQuantity, finishQuantity) {
    const products = await ProductModel.searchByPageMobile({ category: data.category }, initQuantity, finishQuantity)
    const arrayProducts = []
    for (const product of products) {
      const productsCategory = await AvailabilityModel.get({ idSupermarket: data.idSupermarket, idProduct: product._id, isActive: true })
      if (productsCategory._id){
        arrayProducts.push(productsCategory)
      }
    }
    if (arrayProducts.length > 0) {
      return { estado: true, data: arrayProducts, mensaje: null }
    } else {
      return { estado: false, data: [], mensaje: 'Esta categoria no tiene productos' }
    }
  }

  async productsForName(data, quantity, page) {
    AvailabilityModel.perPage = parseInt(quantity)
    const products = await ProductModel.searchByPage({ name: data.name }, page)
    const countAvailability = await AvailabilityModel.count({})
    const arrayProducts = []
    for (const product of products) {
      const productsName = await AvailabilityModel.get({ idSupermarket: data.idSupermarket, idProduct: product._id, isActive: true })
      if (productsName._id) {
        arrayProducts.push(productsName)
      }
    }
    if (arrayProducts.length > 0) {
      return { estado: true, data: { page: page, quantity: quantity, total: countAvailability, items: arrayProducts }, mensaje: null }
    } else {
      return { estado: false, data: [], mensaje: 'No existe productos cor este nombre' }
    }
  }

  async productsForNameMobile(data, initQuantity, finishQuantity) {
    const products = await ProductModel.searchByPageMobile({ name: data.name }, initQuantity, finishQuantity)
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

  async momentWithOutPageProductsForName(data) {
    console.log(data)
    const products = await ProductModel.search({ name: data.name })
    console.log(products)
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

  async forSuperMarket (_id, query, quantity, page) {
    const availability = []
    const superMarket = await SuperMarketModel.get({ idAdmin: _id })
    const countAvailability = await AvailabilityModel.count({idSupermarket: superMarket._id})
    if (query.name) {
      ProductModel.perPage = parseInt(quantity)
      query.name = { $regex: query.name, $options: 'i' }
      const products = await ProductModel.searchByPage(query, page)
      for (const object of products) {
        const category = await CategoryModel.get({ _id: object.category })
        const availabilityProduct = await AvailabilityModel.get({ idSupermarket: superMarket._id, idProduct: object._id })
        if (availabilityProduct._id) {
          availabilityProduct._doc.idProduct._doc.category = category
          availability.push(availabilityProduct)
        }
      }
    } else if (query.category) {
      ProductModel.perPage = parseInt(quantity)
      const products = await ProductModel.searchByPage(query, page)
      for (const object of products) {
        const category = await CategoryModel.get({ _id: object.category })
        const availabilityProduct = await AvailabilityModel.get({ idSupermarket: superMarket._id, idProduct: object._id })
        if (availabilityProduct._id) {
          availabilityProduct._doc.idProduct._doc.category = category
          availability.push(availabilityProduct)
        }
      }
    } else if (!query.name && !query.category) {
      AvailabilityModel.perPage = parseInt(quantity)
      const availabilityProduct = await AvailabilityModel.searchByPage({ idSupermarket: superMarket._id }, page)
      console.log(availabilityProduct)
      for (const object of availabilityProduct) {
        const category = await CategoryModel.get({ _id: object.idProduct.category })
        object._doc.idProduct._doc.category = category
        availability.push(object)
      }
    }
    if (availability.length > 0) {
      return { estado: true, data: { page: page, quantity: quantity, total: countAvailability, items: availability }, mensaje: null }
    } else {
      return { estado: false, data: [], mensaje: 'No existen productos para este supermercado' }
    }
  }

    async categoryData () {
      try {
        const categorys = await categoryModel.search({})
        let count = 0
        for (let r = 0; r <= 20; r++) {
          for (const category of categorys) {
            count++
            const random = await generalController.createCode()
            const obj = {
              image: ['https://jumbocolombiafood.vteximg.com.br/arquivos/ids/3323070-750-750/7702129075275-1.jpg?v=636670897146530000'],
              idPos: random,
              name: `Jamón${count}`,
              description: 'Descripción de el producto',
              category: category.name,
              defaultprice: 12300
            }
            const create = await ProductModel.create(obj)
            console.log(create)
          }
        }
        return 'Successful!'
      } catch (error) {
        console.log(error)
        return 'Failure!'
      }
    }
}

module.exports = new Product()
