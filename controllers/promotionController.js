'use strict'
const PromotionModel = require('../models/promotionSchema')
const SuperMarketModel = require('../models/supermarketSchema')

class Promotion {
  async create (data) {
    console.log(data)
    const isExist = await PromotionModel.get({ name: data.name, supermarket: data.supermarket })
    if (!isExist._id) {
      const promotion = await PromotionModel.create(data)
      return { estado: true, data: promotion, mensaje: null }
    } else {
      return { estado: false, data: [], mensaje: 'La promocion ya se encuentra resgitrada' }
    }
  }

  async update (id, data) {
    const isExist = await PromotionModel.get(id)
    if (isExist._id) {
      const update = await PromotionModel.update(isExist._id, data)
      return update
    } else {
      return { estado: false, data: [], mensaje: 'No existe esta promoción' }
    }
  }

  async detail (id) {
    const promotion = await PromotionModel.get(id)
    if (promotion._id) {
      return { estado: true, data: promotion, mensaje: null }
    } else {
      return { estado: false, data: [], mensaje: 'No existe esta promoción' }
    }
  }

  async allPage (data, quantity, page) {
    PromotionModel.perPage = parseInt(quantity)
    const promotions = await PromotionModel.searchByPage(data, page)
    const countPromotions = await PromotionModel.count({})
    if (promotions.length > 0) {
      return { estado: true, data: { page: page, quantity: quantity, total: countPromotions, items: promotions }, mensaje: null }
    } else {
      return { estado: false, data: [], mensaje: 'No existen promociones para este supermercado' }
    }
  }

  async all (data, initQuantity, finishQuantity) {
    const promotion = await PromotionModel.searchByPageMobile(data, initQuantity, finishQuantity)
    if (promotion.length > 0) {
      return { estado: true, data: promotion, mensaje: null }
    } else {
      return { estado: false, data: [], mensaje: 'No existen promociones para este supermercado' }
    }
  }

  async forSuperMarket (_id, query, quantity, page) {
    PromotionModel.perPage = parseInt(quantity)
    let promotions
    const superMarket = await SuperMarketModel.get({ idAdmin: _id })
    if (query.name) {
      promotions = await PromotionModel.searchByPage({ supermarket: superMarket, name: { $regex: query.name, $options: 'i' } }, page)
    } else {
      promotions = await PromotionModel.searchByPage({ supermarket: superMarket }, page)
    }
    if (promotions.length > 0) {
      return { estado: true, data: promotions, mensaje: null }
    } else {
      return { estado: false, data: [], mensaje: 'No hay promociones para este supermercado' }
    }
  }

  async count () {
    const countPromotions = await PromotionModel.count()
    return countPromotions
  }

  async countSupermarket (supermarket) {
    const countPromotions = await PromotionModel.count({ supermarket: supermarket })
    return countPromotions
  }
}

module.exports = new Promotion()
