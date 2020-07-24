'user strict'
const mongoose = require('mongoose')
const Base = require('./baseSchema')
const Types = mongoose.Schema.Types

const Schema = new mongoose.Schema({
  name: {
    type: Types.String,
    required: [true, 'El nombre es obligatorio'],
    lowercase: true
  },
  status: {
    type: Types.Boolean,
    default: true
  }
})

Schema.path('name').validate({
  isAsync: true,
  validator: (value, respond) => {
    mongoose.models['Country'].findOne({ name: value }, (error, country) => {
      if (error) {}
      if (country) {
        respond(false)
      }
      respond()
    })
  },
  message: 'El pais ya existe'
})

class Country extends Base {
  constructor () {
    super()
    this.sort = { name: 1 }
    this.model = mongoose.model('Country', Schema)
    this.fields = 'name status'
  }
}

module.exports = new Country()
