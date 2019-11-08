'use strict'

const PqrModel = require('../models/pqrSchema')

class Pqr {

    async create(data) {
        const create = await PqrModel.create(data)
        return create
    }

    async getAll() {
        const data = await PqrModel.search({})
        return data
    }

    async getFirst(_id) {
        const data = await PqrModel.search({ userId: _id })
        return data
    }

    async update(_id, data) {
        const isExist = await PqrModel.get({ _id })
        if (isExist._id) {
            return PqrModel.update({ _id: isExist._id }, { response: data.response, createUpdate: Date.now(), isResponse: true })
        } else {
            return { error: 'El pqr no ha sido actualizado' }
        }
    }
}

module.exports = new Pqr()