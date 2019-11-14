const availabilityModel = require('../models/availabilitySchema')

class Availability {
    async create(data) {
        const isExist = await availabilityModel.get({ idSupermarket: data.idSupermarket })
        if (!isExist) {
            const create = await availabilityModel.create(data)
            return { estado: true, data: [], mensaje: null }
        } else {
            return { estado: false, data: [], mensaje: 'Error en la creación' }
        }
    }


}

module.exports = new Availability()