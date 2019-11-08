'use strict'

const PqrModel = require('../models/pqrSchema')

class Pqr {
    async create(data) {
        const create = await PqrModel.create(data)
        return create
    }
}

module.exports = new Pqr()