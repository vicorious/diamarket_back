'use strict'
const CountryModel = require('../models/countrySchema')

class Country {
  async create (data) {
    const isExist = await CountryModel.get({ name: data.name })
    if (!isExist._id) {
      const country = await CountryModel.create(data)
      return country
    } else {
      return { errors: { message: 'EL pais ya existe' } }
    }
  }

  async getAll () {
    const countrys = await CountryModel.search({})
    if (countrys.length > 0) {
      return countrys
    } else {
      return { errors: { message: 'No hay países' } }
    }
  }

  async editStatus (id, data) {
    const country = await CountryModel.get({ _id: id })
    if (country._id) {
      return CountryModel.update(country._id, data)
    } else {
      return { errors: { message: 'El pais no existe' } }
    }
  }
}
module.exports = new Country()
