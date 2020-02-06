const OrderServiceModel = require('../models/orderServiceSchema')
const AvailabilityModel = require('../models/availabilitySchema')
const PromotionModel = require('../models/promotionSchema')
const PayUController = require('../controllers/payUController')

class OrderService {
  async create1 (data) {
    console.log(data                                                             )
  }

  async create (id, data) {
    let sumPricesProduct = 0
    let sumPricesPromotion = 0
    if (data.products && data.promotions) {
      const prom = data.promotions.map(async function (obj) {
        const promotion = await PromotionModel.get({ _id: obj, supermarket: data.superMarket })
        const promotionPrice = promotion.discount
        sumPricesPromotion = sumPricesPromotion + promotionPrice
        return sumPricesPromotion
      })
      const prod = data.products.map(async function (obj) {
        const product = await AvailabilityModel.get({ idProduct: obj, idSupermarket: data.superMarket })
        const productPrice = product.price
        sumPricesProduct = sumPricesProduct + productPrice
        return sumPricesProduct
      })
      const arrayPricesPromotions = await Promise.all(prom)
      const arrayPricesProducts = await Promise.all(prod)
      data.value = arrayPricesProducts[arrayPricesProducts.length - 1] + arrayPricesPromotions[arrayPricesPromotions.length - 1]
    }
    if (data.products && !data.promotions) {
      const prod = data.products.map(async function (obj) {
        const product = await AvailabilityModel.get({ idProduct: obj, idSupermarket: data.superMarket })
        const productPrice = product.price
        sumPricesProduct = sumPricesProduct + productPrice
        return sumPricesProduct
      })
      const arrayPricesProducts = await Promise.all(prod)
      data.value = arrayPricesProducts[arrayPricesProducts.length - 1]
    }
    if (!data.products && data.promotions) {
      const prom = data.promotions.map(async function (obj) {
        const promotion = await PromotionModel.get({ _id: obj, supermarket: data.superMarket })
        const promotionPrice = promotion.discount
        sumPricesPromotion = sumPricesPromotion + promotionPrice
        return sumPricesPromotion
      })
      const arrayPricesPromotions = await Promise.all(prom)
      data.value = arrayPricesPromotions[arrayPricesPromotions.length - 1]
    }
    data.user = id
    const create = await OrderServiceModel.create(data)
    if (create._id) {
      return { estado: true, data: create, mensaje: null }
    } else {
      return { estado: false, data: [], mensaje: 'Error al crear la orden' }
    }
  }

  async update (id, data) {
    const isExist = await OrderServiceModel.get(id)
    if (isExist._id) {
      const update = await OrderServiceModel.update(isExist._id, data)
      return update
    } else {
      return { estado: false, data: [], mensaje: 'No se ha encontrado la orden' }
    }
  }

  async detail (id) {
    const isExist = await OrderServiceModel.get(id)
    if (isExist._id) {
      return { estado: true, data: isExist, mensaje: null }
    } else {
      return { estado: false, data: [], mensaje: 'No se ha encontrado la orden' }
    }
  }

  async allForClien (user) {
    const isExist = await OrderServiceModel.search(user)
    if (isExist.length > 0) {
      return { estado: true, data: isExist, mensaje: null }
    } else {
      return { estado: false, data: [], mensaje: 'No se han encontrado ordenes' }
    }
  }
}

module.exports = new OrderService()
