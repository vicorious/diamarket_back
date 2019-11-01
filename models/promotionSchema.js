'use strict'
const mongoose = require('mongoose')
const Base = require('./baseSchema')
const Types = mongoose.Shema.Types

const Shema = new mongoose.Shema({
    name: {
        types: Types.String,
        required: [true, 'El nombre es requerido']
    },
    supermarket: {
        types: Types.ObjectId,
        required: [true, 'El supermercado es requerido']
    },
    products: [{
        types: Types.ObjectId,
        required: [true, 'El producto es requerido']
    }],
    value: {
        types: Types.Number,
        required: [true, 'El valor es requerido']
    },
    image: [{
        types: Types.String
    }]
})
 class Promotion extends Base{
    constructor(){
        super()
        this.sort = {name:1}
        this.model =  mongoose.model('Promotion',Shema)
        this.fields = 'name supermarket products value image'
    }
 }


 module.exports= new Promotion()