'use strict'

const PqrModel = require('../models/pqrSchema')

class Pqr {

    async create(data) {
        const create = await PqrModel.create(data)
        return { estado: true, data: [], mensaje: null }
    }

    async getAll() {
        const data = await PqrModel.search({})
        return { estado: true, data: data, mensaje: null }
    }

    async getFirst(_id) {
        const data = await PqrModel.search({ userId: _id })
        return { estado: true, data: data, mensaje: null }
    }

    async update(_id, data) {
        const isExist = await PqrModel.get({ _id })
        if (isExist._id) {
            const update = await PqrModel.update({ _id: isExist._id }, { response: data.response, createUpdate: Date.now(), isResponse: true })
            return { estado: true, data: [], mensaje: null }
        } else {
            return { estado: false, data: [], mensaje: 'El pqr no ha sido actualizado' }
        }
    }
}

module.exports = new Pqr()