'use strict'
const CityModel = require('../models/citySchema')

class Country {
  async create (data) {
    const isExist = await CityModel.get({ name: data.name })
    if (!isExist._id) {
      const city = await CityModel.create(data)
      return city
    } else {
      return { errors: { message: 'La ciudad ya existe' } }
    }
  }

  async getAll () {
    const citys = await CityModel.search({})
    if (citys.length > 0) {
      return citys
    } else {
      return { errors: { message: ' No hay ciudades ' } }
    }
  }

  async editStatus (id, data) {
    const city = await CityModel.get({ _id: id })
    if (city._id) {
      return CityModel.update(city._id, data)
    } else {
      return { errors: { message: 'La ciudad no existe' } }
    }
  }

  async findByState (id) {
    const cityByState = await CityModel.search({ state: id })
    if (cityByState.length > 0) {
      return cityByState
    } else {
      return { errors: { message: 'El departamento no tiene departamentos' } }
    }
  }
}
module.exports = new Country()
