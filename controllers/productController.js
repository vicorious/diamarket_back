'use strict'
const ProductModel = require('../models/productSchema')
const AvailabilityModel = require('../models/availabilitySchema')
const SuperMarketModel = require('../models/supermarketSchema')
const CategoryModel = require('../models/categorySchema')
const MsSql = require('mssql')
const fs = require('fs')
const path = require('path')
const uploadFile = require('../middleware/uploadFile')
const { DATABASES } = require('../config/settings')

class Product {
  async createPost() {
    const products = await MsSql.query`
    SELECT items.f120_rowid as 'id_product', items.f120_descripcion as 'name_product', items.f120_descripcion_corta, items.f120_id as 'id_item'
    FROM dbo.t120_mc_items as items
    WHERE items.f120_id_cia = 6 AND items.f120_ind_venta = 1;
  `
    if (products.recordset.length > 0) {
      for (const object of products.recordset) {
        const data = {
          idPos: object.id_product,
          name: object.name_product,
          description: object.f120_descripcion_corta,
          idImage: object.id_item
        }
        await ProductModel.create(data)
      }
      return products
    }
  }

  async assignedImage() {
    const routeFile = `${path.dirname(__dirname)}/images`
    const filesImages = await fs.readdirSync(routeFile)
    for (const item of filesImages) {
      const nameItem = item.split('.')[0]
      const product = await ProductModel.get({ idImage: nameItem })
      if (product._id) {
        const bitImage = fs.readFileSync(`${routeFile}/${item}`)
        const base64Image = new Buffer(bitImage).toString('base64')
        const file = await uploadFile(Buffer.from(base64Image, 'base64'), item, 'base64')
        await ProductModel.update(product._id, { image: file })
      }
    }
    console.log('Terminidado')
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

  async detailApp(id) {
    const isExist = await ProductModel.get(id)
    if (isExist._id) {
      const product = await AvailabilityModel.get({ idProduct: isExist._id })
      product.idProduct._doc.category = await CategoryModel.get({ _id: product.idProduct.category })
      product.idProduct._doc.price = product.price
      product.idProduct._doc.quantity = product.quantity
      delete product.idProduct._doc.category._doc.subCategory
      delete product._doc.price
      delete product._doc.quantity
      return { estado: true, data: product, mensaje: null }
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
    for (const object of products) {
      const category = await CategoryModel.get({ _id: object.idProduct.category })
      delete category._doc.subCategory
      object.idProduct._doc.category = category   
      object.idProduct._doc.price = object.price
      object.idProduct._doc.quantity = object.quantity
      delete object._doc.price
      delete object._doc.quantity
    }
    if (products.length > 0) {
      return { estado: true, data: products, mensaje: null }
    } else {
      return { estado: false, data: [], mensaje: 'Este supermercado no tiene productos' }
    }
  }

  async productsForCategoryApp (data, initQuantity, finishQuantity) {
    const products = await ProductModel.searchByPageMobile({ category: data.category, subCategory: data.subCategory }, initQuantity, finishQuantity)
    const arrayProducts = []
    for (const product of products) {
      const productsCategory = await AvailabilityModel.get({ idSupermarket: data.idSupermarket, idProduct: product._id, isActive: true })
      if (productsCategory._id){
        const category = await CategoryModel.get({ _id: productsCategory.idProduct.category })
        delete category._doc.subCategory
        productsCategory.idProduct._doc.category = category
        productsCategory.idProduct._doc.price = productsCategory.price
        productsCategory.idProduct._doc.quantity = productsCategory.quantity
        delete productsCategory._doc.price
        delete productsCategory._doc.quantity
        arrayProducts.push(productsCategory)
        calification = 0
      }
    }
    if (arrayProducts.length > 0) {
      return { estado: true, data: arrayProducts, mensaje: null }
    } else {
      return { estado: false, data: [], mensaje: 'Esta categoria no tiene productos' }
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

  async productsForCategoryAppLimit (data) {
    const productLength = await ProductModel.count({ subCategory: data.subCategory })
    const initQuantity = Math.floor(Math.random() * productLength) + 1
    const finishQuantity = initQuantity + 5
    console.log(productLength,initQuantity,finishQuantity)
    const products = await ProductModel.searchByPageMobile({ subCategory: data.subCategory }, initQuantity, finishQuantity)
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
      return { estado: false, data: [], mensaje: 'Esta subcategoria no tiene productos' }
    }
  }

  async productsForName(data, quantity, page) {
    AvailabilityModel.perPage = parseInt(quantity)
    const products = await ProductModel.searchByPage({ name: data.name }, page)
    const countAvailability = await AvailabilityModel.count({})
    const arrayProducts = []
    for (const product of products) {
      const productsName = await AvailabilityModel.get({ idProduct: product._id, isActive: true })
      if (productsName._id) {
        arrayProducts.push(productsName)
      }
    }
    if (arrayProducts.length > 0) {
      return { estado: true, data: { page: page, quantity: quantity, total: countAvailability, items: arrayProducts }, mensaje: null }
    } else {
      return { estado: false, data: [], mensaje: 'No se encuentran productos disponibles o el nombre no ha sido encontrado' }
    }
  }
  async productsForNameSupermarket(data, quantity, page) {
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
      return { estado: false, data: [], mensaje: 'No se encuentran productos disponibles o el nombre no ha sido encontrado' }
    }
  }

  async productsSuggestion (product, category, subCategory, idSupermarket) {
    const products = await ProductModel.limit({ _id: { $ne: product }, category, subCategory }, 20)
    const arrayProducts  = []
    let newProducts = []
    for (const product of products) {
      const productsName = await AvailabilityModel.get({ idSupermarket, idProduct: product._id, isActive: true })
      if (productsName._id) {
        arrayProducts.push(productsName)
      }
    }
    if (arrayProducts.length > 5) {
      let selectProduct = { _id: '' }
      for (let i = 0; i < 5; i++) {
        const random = Math.floor(Math.random() * Math.floor(arrayProducts.length))
        const randomProduct = arrayProducts[random]
        if (selectProduct._id.toString() !== randomProduct._id.toString()) {
          const category =  await CategoryModel.get({ _id: randomProduct.idProduct.category })
          randomProduct.idProduct._doc.category =  category
          randomProduct.idProduct._doc.price = randomProduct.price
          randomProduct.idProduct._doc.quantity = randomProduct.quantity
          delete randomProduct.idProduct.category._doc.subCategory
          delete randomProduct.price
          delete randomProducts.quantity
          newProducts.push(randomProduct)
          selectProduct = randomProduct
        }
      } 
      return newProducts
    } else {
      newProducts = arrayProducts
      for (const object of newProducts) {
        object.idProduct._doc.category = await CategoryModel.get({ _id: object.idProduct.category })
        object.idProduct._doc.price = object.price
        object.idProduct._doc.quantity = object.quantity
        delete object.idProduct.category._doc.subCategory
        delete object._doc.price
        delete object._doc.quantity
      }
      return newProducts
    }
  }

  async productsForNameMobile(data, initQuantity, finishQuantity) {
    const products = await ProductModel.searchByPageMobile({ name: data.name }, initQuantity, finishQuantity)
    const arrayProducts = []
    for (const product of products) {
      const productsName = await AvailabilityModel.get({ idSupermarket: data.idSupermarket, idProduct: product._id, isActive: true })
      if (productsName._id){
        const category = await CategoryModel.get({ _id: productsName.idProduct.category })
        delete category._doc.subCategory
        productsName.idProduct._doc.category = category
        productsName.idProduct._doc.price = productsName.price
        productsName.idProduct._doc.quantity = productsName.quantity
        delete productsName._doc.price
        delete productsName._doc.quantity
        arrayProducts.push(productsName)
        calification = 0
      }
    }
    if (arrayProducts.length > 0) {
      return { estado: true, data: arrayProducts, mensaje: null }
    } else {
      return { estado: false, data: [], mensaje: 'No existe productos cor este nombre' }
    }
  }

  async momentWithOutPageProductsForName(data) {
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
