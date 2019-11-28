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
        const count = await PromotionModel.count()
        return count
    }
    async detail(data) {
        const promotion = await PromotionModel.get(data)
        if (promotion._id) {
            return { estado: true, data: promotion, mensaje: null }
        } else {
            return { estado: false, data: [], mensaje: "El usuario no se encuentra registrado" }
        }
    }

    async detailAll(data) {
        const promotion = await PromotionModel.search(data)
        if (promotion.length > 0) {
            return { estado: true, data: promotion, mensaje: null }
        } else {
            return { estado: false, data: [], mensaje: "No se encuentra la promocion" }
        }
    }
}

module.exports = new Promotion()