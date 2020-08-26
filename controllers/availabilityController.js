const availabilityModel = require('../models/availabilitySchema')
const SuperMarketModel = require('../models/supermarketSchema')
const ProductModel = require('../models/productSchema')
const MsSql = require('mssql')
// const productModel = require('../models/productSchema')
// const cate = require('../models/categorySchema')
// const pro = require('../models/promotionSchema')

class Availability {
  async createPos () {
    console.log("HOLAAA")
    const supermarkets = await SuperMarketModel.search({})
    const stockProd = []
    for (const object of supermarkets) {
      const stock = await this.createStockPos(object.idPos)
      stockProd.push({ supermarket: object, stock })
      // for (const objectStock of stock.recordset) {
      //   const product = await ProductModel.get({ idPos: objectStock.f126_rowid_item })
      //   const dataStock = {
      //     idSupermarket: object._id,
      //     idProduct: product._id,
      //     quantity: objectStock.f400_cant_existencia_1,
      //     price: objectStock.f126_precio
      //   }
      //   await availabilityModel.create(dataStock)
      // }
    }
    return stockProd
  }

  async createStockPos (supermarket) {
    const stock = await MsSql.query`
    SELECT dbo.t285_co_centro_op.f285_id, dbo.t285_co_centro_op.f285_descripcion, dbo.t126_mc_items_precios.f126_rowid_item, dbo.t400_cm_existencia.f400_cant_existencia_1, dbo.t126_mc_items_precios.f126_id_unidad_medida, dbo.t126_mc_items_precios.f126_precio
    FROM dbo.t120_mc_items INNER JOIN (dbo.t126_mc_items_precios INNER JOIN (dbo.t285_co_centro_op INNER JOIN ((dbo.t400_cm_existencia INNER JOIN dbo.t121_mc_items_extensiones ON dbo.t400_cm_existencia.f400_rowid_item_ext = dbo.t121_mc_items_extensiones.f121_rowid) INNER JOIN dbo.t150_mc_bodegas ON dbo.t400_cm_existencia.f400_rowid_bodega = dbo.t150_mc_bodegas.f150_rowid) ON (dbo.t285_co_centro_op.f285_id = dbo.t150_mc_bodegas.f150_id_co) AND (dbo.t285_co_centro_op.f285_id_cia = dbo.t150_mc_bodegas.f150_id_cia)) ON dbo.t126_mc_items_precios.f126_rowid_item = dbo.t121_mc_items_extensiones.f121_rowid_item) ON (dbo.t126_mc_items_precios.f126_id_unidad_medida = dbo.t120_mc_items.f120_id_unidad_inventario) AND (dbo.t120_mc_items.f120_rowid = dbo.t126_mc_items_precios.f126_rowid_item)
    WHERE (((dbo.t126_mc_items_precios.f126_id_cia)=6) AND ((dbo.t126_mc_items_precios.f126_id_lista_precio)='050') AND ((dbo.t285_co_centro_op.f285_id)<>'001' And (dbo.t285_co_centro_op.f285_id)<>'002') AND ((dbo.t150_mc_bodegas.f150_descripcion) Like '%PRINCIPAL%')) AND dbo.t285_co_centro_op.f285_id =${supermarket.toString()}
    ORDER BY dbo.t285_co_centro_op.f285_id, dbo.t126_mc_items_precios.f126_rowid_item, dbo.t126_mc_items_precios.f126_id_unidad_medida
    `
    return stock
  }

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
