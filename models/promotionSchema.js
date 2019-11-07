'use strict'
const mongoose = require('mongoose')
const Base = require('./baseSchema')
const Types = mongoose.Schema.Types

const Schema = new mongoose.Schema({
    name: {
        type: Types.String,
        required: [true, 'El nombre es requerido']
    },
    supermarket: {
        type: Types.ObjectId,
        required: [true, 'El supermercado es requerido']
    },
    products: [{
        type: Types.ObjectId,
        required: [true, 'El producto es requerido']
    }],
    value: {
        type: Types.Number,
        required: [true, 'El valor es requerido']
    },
    image: [{
        type: Types.String
    }]
})
 class Promotion extends Base{
    constructor(){
        super()
        this.sort = {name:1}
        this.model =  mongoose.model('Promotion',Schema)
        this.fields = 'name supermarket products value image'
    }
 }


 module.exports= new Promotion()