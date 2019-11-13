const availabilityModel = require('../models/availabilitySchema')

class Availability {
    async create(data) {
        const isExist = await availabilityModel.get({ idSupermarket: data.idSupermarket })
        if (!isExist) {
            const create = await availabilityModel.create(data)
            return create
        } else {
            return { error: 'Ya existe la disponibilidad para este supermercado' }
        }
    }


}

module.exports = new Availability()