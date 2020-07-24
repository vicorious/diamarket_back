'use strict'
const StateModel = require('../models/stateSchema')

class State {
  async create (data) {
    const isExist = await StateModel.get({ name: data.name })
    if (!isExist._id) {
      const state = await StateModel.create(data)
      return state
    } else {
      return { errors: { message: 'EL departamento ya existe' } }
    }
  }

  async getAll () {
    const states = await StateModel.search({})
    if (states.length > 0) {
      return states
    } else {
      return { errors: { message: ' No hay departamentos ' } }
    }
  }

  async editStatus (id, data) {
    const state = await StateModel.get({ _id: id })
    if (state._id) {
      return StateModel.update(state._id, data)
    } else {
      return { errors: { message: 'El departamento no existe' } }
    }
  }

  async findByCountry (id) {
    const stateByCountry = await StateModel.search({ country: id })
    if (stateByCountry.length > 0) {
      return stateByCountry
    } else {
      return { errors: { message: 'El pais no tiene departamentos' } }
    }
  }
}
module.exports = new State()
