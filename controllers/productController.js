'use strict'
const ProductModel = require('../models/productSchema')
const AvailabilityModel = require('../models/availabilitySchema')
const SuperMarketModel = require('../models/supermarketSchema')
const CategoryModel = require('../models/categorySchema')
const MsSql = require('mssql')
const { DATABASES } = require('../config/settings')

class Product {
  async create (data) {
    const products = await MsSql.query`
    SELECT TOP 100 dbo.t126_mc_items_precios.f126_rowid_item as 'IdProduct', dbo.t285_co_centro_op.f285_id, dbo.t285_co_centro_op.f285_descripcion, dbo.t120_mc_items.f120_descripcion,dbo.t126_mc_items_precios.f126_id_unidad_medida,dbo.t126_mc_items_precios.f126_precio FROM (((dbo.t285_co_centro_op INNER JOIN (dbo.t126_mc_items_precios INNER JOIN dbo.t120_mc_items ON dbo.t126_mc_items_precios.f126_rowid_item = dbo.t120_mc_items.f120_rowid) ON (dbo.t285_co_centro_op.f285_id = dbo.t126_mc_items_precios.f126_id_lista_precio) AND (dbo.t285_co_centro_op.f285_id_cia = dbo.t126_mc_items_precios.f126_id_cia)) INNER JOIN dbo.t121_mc_items_extensiones ON dbo.t120_mc_items.f120_rowid = dbo.t121_mc_items_extensiones.f121_rowid_item)  INNER JOIN dbo.t400_cm_existencia ON dbo.t121_mc_items_extensiones.f121_rowid = dbo.t400_cm_existencia.f400_rowid_item_ext) WHERE (((dbo.t285_co_centro_op.f285_id_cia)=6) AND ((dbo.t285_co_centro_op.f285_id)<>'001' And (dbo.t285_co_centro_op.f285_id)<>'002')) ORDER BY dbo.t285_co_centro_op.f285_id;    
    `

    const categorys = await MsSql.query`
    SELECT dbo.t125_mc_items_criterios.f125_rowid_item, dbo.t125_mc_items_criterios.f125_id_plan, dbo.t106_mc_criterios_item_mayores.f106_id, dbo.t106_mc_criterios_item_mayores.f106_descripcion
FROM dbo.t125_mc_items_criterios INNER JOIN dbo.t106_mc_criterios_item_mayores ON (dbo.t125_mc_items_criterios.f125_id_cia = dbo.t106_mc_criterios_item_mayores.f106_id_cia) AND (dbo.t125_mc_items_criterios.f125_id_criterio_mayor = dbo.t106_mc_criterios_item_mayores.f106_id) AND (dbo.t125_mc_items_criterios.f125_id_plan = dbo.t106_mc_criterios_item_mayores.f106_id_plan)
WHERE (((dbo.t125_mc_items_criterios.f125_id_plan)='CAT' Or (dbo.t125_mc_items_criterios.f125_id_plan)='SUB') AND ((dbo.t125_mc_items_criterios.f125_id_cia)=6))
ORDER BY dbo.t125_mc_items_criterios.f125_rowid_item, dbo.t125_mc_items_criterios.f125_id_plan, dbo.t106_mc_criterios_item_mayores.f106_id;
    `

    return { products, categorys }
    // const isExist = await ProductModel.get({ name: data.name })
    // if (!isExist._id) {
    //   const product = await ProductModel.create(data)
    //   if (product._id) {
    //     return { estado: true, data: product, mensaje: null }
    //   } else {
    //     return { estado: false, data: [], mensaje: 'Error al almacencar datos' }
    //   }
    // } else {
    //   return { estado: false, data: [], mensaje: 'Ya existe el producto' }
    // }
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
    console.log(data)
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

  async forSuperMarket (_id, query) {
    let availability = []
    const superMarket = await SuperMarketModel.get({ idAdmin: _id })
    if (query.name) {
      query.name = { $regex: query.name, $options: 'i' }
      const products = await ProductModel.search(query)
      for (const object of products) {
        const availabilityProduct = await AvailabilityModel.get({ idSupermarket: superMarket._id, idProduct: object._id })
        if (availabilityProduct._id) {
          availability.push(availabilityProduct)
        }
      }
    } else if (query.category) {
      const products = await ProductModel.search(query)
      for (const object of products) {
        const availabilityProduct = await AvailabilityModel.get({ idSupermarket: superMarket._id, idProduct: object._id })
        if (availabilityProduct._id) {
          availability.push(availabilityProduct)
        }
      }
    } else if (!query.name && !query.category) {
      console.log('SIIIIIIIIII')
      const availabilityProduct = await AvailabilityModel.get({ idSupermarket: superMarket._id })
      console.log('Ya hizo la consulta')
      availability = availabilityProduct
      console.log('ESTE YA ES EL ARRAY')
      console.log(availability)
    }
    if (availability.length > 0) {
      return { estado: true, data: availability, mensaje: null }
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
