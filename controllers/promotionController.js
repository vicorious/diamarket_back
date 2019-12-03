'use strict'
const PromotionModel = require('../models/promotionSchema')

class Promotion {
    async create(data) {
        const isExist = await PromotionModel.get({ name: data.name, supermarket: data.supermarket })
        if (!isExist._id) {
            data.image = data.images
            delete data.images
            const promotion = await PromotionModel.create(data)
            return { estado: true, data: promotion, mensaje: null }
        } else {
            return { estado: false, data: [], mensaje: 'La promocion ya se encuentra resgitrada' }
        }
    }

    async count() {
        const count = await PromotionModel.count({ isActive: true })
        return count
    }

    async detail(_id) {
        const promotion = await PromotionModel.get({ _id, isActive: true })
        console.log(promotion);
        if (promotion._id) {
            return { estado: true, data: promotion, mensaje: null }
        } else {
            return { estado: false, data: [], mensaje: "No existe esta promoción" }
        }
    }

    async inactivate(_id) {
        const isExist = await PromotionModel.get({ _id })
        if (isExist._id) {
            const inactivate = await PromotionModel.update(isExist._id, { isActive: false })
            return inactivate
        } else {
            return { estado: false, data: [], mensaje: 'No se ha desctivado la promoción' }
        }
    }

    async detailAll(data) {
        const promotion = await PromotionModel.search({ supermarket: data, isActive: true })
        if (promotion.length > 0) {
            return { estado: true, data: promotion, mensaje: null }
        } else {
            return { estado: false, data: [], mensaje: "No se encuentra la promocion" }
        }
    }
}

module.exports = new Promotion()