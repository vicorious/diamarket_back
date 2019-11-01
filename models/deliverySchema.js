'use strict'
const mongoose = require('mongoose')
const Base = require('./baseSchema')
const Types = mongoose.Schema.Types


const Schema = new mongoose.Schema({
    orderId: {
        types: Types.String
    },
    idUser: {
        types: Types.ObjectId
    },
    status: {
        types: Types.String
    },
    description: {
        types: Types.String
    }
})


class Delivery extends Base {
    constructor(){
        super()
        this.sort = {name:1}
        this.model = mongoose.model('Delivery',Schema)
        this.fields = 'orderId idUser status description'
    }
}

module.exports = new Delivery()