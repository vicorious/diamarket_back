'use strict'
const PromotionModel = require('../models/promotionSchema')

class Promotion {
    async create(data) {
        const isExist = await PromotionModel.get({ name: data.name, supermarket: data.supermarket })
        if (!isExist._id) {
            const promotion = await PromotionModel.create(data)
            if (promotion._id) {
                return { estado: true, data: promotion, mensaje: null }
            } else {
                return { estado: false, data: [], mensaje: 'Error al almacenar los datos' }
            }
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
            return { estado: false, data: [], mensaje: "No se encuentran datos" }
        }
    }
}

module.exports = new Promotion()