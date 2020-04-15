'use strict'
const makeErrors = require('../utils/makeErrors')

class Base {
  constructor () {
    this.model = undefined
    this.populate = undefined
    this.sort = undefined
    this.perPage = 50
    this.fields = undefined
  }

  async create (data) {
    const model = this.model(data)
    let response
    try {
      response = await model.save()
      response = { _id: response._id }
    } catch (error) {
      console.log(error)
      response = makeErrors(error.errors)
    }
    return response
  }

  async all () {
    const objects = this.search({}, this.fields).sort(this.sort)
    return objects
  }

  async get (data) {
    try {
      let results = await this.model.findOne(data, this.fields).sort(this.sort)
      if (this.populate) {
        results = await this.model.findOne(data, this.fields).populate(this.populate).sort(this.sort)
      }
      if (results) {
        return results
      }
    } catch (error) {}
    return {}
  }

  async search (data) {
    try {
      let objects = await this.model.find(data, this.fields).sort(this.sort)
      if (this.populate) {
        objects = await this.model.find(data, this.fields).populate(this.populate).sort(this.sort)
      }
      return objects
    } catch (error) {
      console.log(error)
      return makeErrors(error.errors)
    }
  }

  async searchByPage (data, page) {
    if (page > 0) {
      let results = await this.model.find(data, this.fields).skip((this.perPage * page) - this.perPage).sort(this.sort).limit(this.perPage).exec()
      if (this.populate) {
        results = await this.model.find(data, this.fields).populate(this.populate).skip((this.perPage * page) - this.perPage).sort(this.sort).limit(this.perPage).exec()
      }
      return results
    } else {
      return []
    }
  }

  async searchByLimit(data, page) {
    if (parseInt(page) === 1) {
      let results = await this.model.find(data, this.fields).skip((50 * page) - 50).sort(this.sort).limit(50).exec()
      if (this.populate) {
        results = await this.model.find(data, this.fields).populate(this.populate).skip((50 * page) - 50).sort(this.sort).limit(50).exec()
      }
      return results
    } else if (parseInt(page) === 2) {
      let results = await this.model.find(data, this.fields).skip((50 * page) - 50).sort(this.sort).exec()
      if (this.populate) {
        results = await this.model.find(data, this.fields).populate(this.populate).skip((50 * page) - 50).sort(this.sort).exec()
      }
      return results
    } else {
      return []
    }
  }

  async filterByPage (page) {
    const results = await this.searchByPage({}, page)
    return results
  }

  async update (_id, data) {
    try {
      await this.model.findByIdAndUpdate(_id, data, { runValidators: true })
      return { estado: true, data: { update: true }, mensaje: null }
    } catch (error) {
      return { estado: false, data: { update: false }, mensaje: 'Error editando los datos' }
    }
  }

  async delete (_id) {
    const object = await this.model.findByIdAndDelete(_id)
    if (object === null) {
      return { estado: false, data: { deleted: false }, mensaje: 'Error al borrar los datos' }
    }
    return { estado: true, data: { deleted: true }, mensaje: null }
  }

  async count (data) {
    const objects = await this.model.find(data).count()
    return objects
  }
}

module.exports = Base
