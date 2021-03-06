'use strict'
const PromotionModel = require('../models/promotionSchema')
const SuperMarketModel = require('../models/supermarketSchema')
const CategoryModel = require('../models/categorySchema')
const AvailabilityModel = require('../models/availabilitySchema')
const moment = require('moment')

class Promotion {
  async create (data) {
    const isExist = await PromotionModel.get({ name: data.name})
    if (!isExist._id) {
      if (data.isAll) {
        const supermarkets = await SuperMarketModel.search({})
        for (const object of supermarkets) {
          data.supermarket.push(object._id)
        }
      }
      if (data.products.length > 0 && data.products.length < 2){
        data.flagPromotion = true
      } else {
        data.flagPromotion = false
      }
      delete data._id
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

  async detailApp (id) {
    const promotion = await PromotionModel.get(id)
    let price = 0
      for (const element of promotion.products) {
        const category = await CategoryModel.get({ _id: element.category })
        const availability = await AvailabilityModel.get({ idProduct: element._id })
        delete category._doc.subCategory
        element._doc.category =  category 
        element._doc.price = availability.price
        element._doc.quantity = availability.quantity
        price += availability.price
      }
      promotion._doc.priceProducts = price
      if (promotion.credits === 0 && promotion.discount === 0) {
        promotion._doc.type = 'totalValue'
        promotion._doc.amount = promotion.value
        promotion._doc.value = 0
        delete promotion._doc.discount
        delete promotion._doc.credits
      } else if (promotion.credits > 0 && promotion.discount === 0) {
        promotion._doc.type = 'credits'
        promotion._doc.amount =  promotion.credits
        // promotion._doc.value = promotion.credits
        delete promotion._doc.discount
        delete promotion._doc.credits
      } else if (promotion.discount > 0 && promotion.credits === 0) {
        promotion._doc.type = 'discount'
        promotion._doc.value = promotion.discount
        promotion._doc.amount =  Math.abs(((price * promotion.discount) / 100) - price)
        delete promotion._doc.discount
        delete promotion._doc.credits
      }
    if (promotion._id) {
      return { estado: true, data: promotion, mensaje: null }
    } else {
      return { estado: false, data: [], mensaje: 'No existe esta promoción' }
    }
  }

  async all (data, initQuantity, finishQuantity) {
    // const currentNow = new Date()
    // const promotion = await PromotionModel.searchByPageMobile({ $and: [{ supermarket: data.supermarket}, { isActive: true }, { initDate: { $gte: new Date(currentNow.setHours('01', '00', '00', '00')) } }, { finishDate: { $lte: new Date() } }]}, initQuantity, finishQuantity)
    const promotion = await PromotionModel.searchByPageMobile({ $and: [{ finishDate: {$gt: new Date()}}, { initDate: {$lt: new Date()}}]})
    let price  = 0
    for (const object of promotion) {
      console.log(object)
      object._doc.initDate = moment(object.initDate).format('YYYY-MM-DD HH:mm')
      object._doc.finishDate = moment(object.finishDate).format('YYYY-MM-DD HH:mm')
      for (const element of object.products) {
        const category = await CategoryModel.get({ _id: element.category })
        const availability = await AvailabilityModel.get({ idProduct: element._id })
        delete category._doc.subCategory
        element._doc.category = category
        element._doc.price = availability.price
        element._doc.quantity = availability.quantity
        price += availability.price
      }
      object._doc.priceProducts = price
      if (object.credits === 0 && object.discount === 0) {
        object._doc.type = 'totalValue'
        object._doc.amount = object.value
        object._doc.value = 0
        delete object._doc.discount
        delete object._doc.credits
      } else if (object.credits > 0 && object.discount === 0) {
        object._doc.type = 'credits'
        object._doc.amount =  object.credits
        // object._doc.value = object.credits
        delete object._doc.discount
        delete object._doc.credits
      } else if (object.discount > 0 && object.credits === 0) {
        object._doc.type = 'discount'
        object._doc.value = object.discount
        object._doc.amount =  Math.abs(((price * object.discount) / 100) - price)
        delete object._doc.discount
        delete object._doc.credits
      }
      price = 0
    }
    if (promotion.length > 0) {
      return { estado: true, data: promotion, mensaje: null }
    } else {
      return { estado: false, data: [], mensaje: 'No existen promociones para este supermercado' }
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

  async forSuperMarket (_id, query, quantity, page) {
    PromotionModel.perPage = parseInt(quantity)
    let promotions
    const superMarket = await SuperMarketModel.get({ idAdmin: _id })
    const countPromotions = await PromotionModel.count({supermarket: { $in: [superMarket._id] }})
    if (query.name) {
      promotions = await PromotionModel.searchByPage({ supermarket: { $in: [superMarket._id] }, name: { $regex: query.name, $options: 'i' } }, page)
    } else {
      promotions = await PromotionModel.searchByPage({ }, page)
    }
    if (promotions.length > 0) {
      return { estado: true, data: { page: page, quantity, total: countPromotions, items: promotions}, mensaje: null }
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
