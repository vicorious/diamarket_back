'use strict'
const mongoose = require('mongoose')
const Base = require('./baseSchema')
const Types = mongoose.Schema.Types

const Schema = new mongoose.Schema({
    status: {
        type: Types.Boolean,
        default: true
    },
    name: {
        type: Types.String,
        require: [true, 'El nombre es requerido']
    },
    address: {
        type: Types.String,
        require: [true, 'La dirección es requerida']
    },
    calification: [{
        type: Types.Number
    }],
    location: {
        type: Types.Mixed,
        require: [true, 'La localización es requerida']
    },
    neigborhood: {
        type: Types.String,
        require: [true, 'El barrio es requerido']
    },
    locality: {
        type: Types.String,
        require: [true, 'La localidad es requerida']
    },
    email: {
        type: Types.String,
        require: [true, 'El email es requerido']
    },
    logo: {
        type: Types.String,
        require: [true, 'El logo es requerido']
    },
    images: [{
        type: Types.String
    }],
    isActive: {
        type: Types.Boolean,
        default: true
    },
    idAdmin: {
        type: Types.ObjectId,
        require: [true, 'El id es requerido']
    },
    schedules: [{
        type: Types.Mixed,
        require: [true, 'El horario es requerido']
    }]
})

Schema.index({ location: '2dsphere' })

class Supermarket extends Base {
    constructor() {
        super()
        this.sort = { email: 1 }
        this.model = mongoose.model('Supermarket', Schema)
        this.fields = 'status name address calification location neigborhood locality email logo images isActive idAdmin schedules'
        this.populate = [{ path: 'idAdmin', model: 'User' }]
    }
}

module.exports = new Supermarket()