'use strict'
const mongoose = require('mongoose')
const Base = require('./baseSchema')
const Types = mongoose.Schema.Types

const Schema = new mongoose.Schema({
    name: {
        type: Types.String,
        require: [true, 'El nombre es requerido']
    },
    description: {
        type: Types.String,
        require: [true, 'La description']
    },
    images: {
        type: Types.String,
        require: [true, 'la imagen es requerida']
    }
})

class Category extends Base {
    constructor() {
        super()
        this.sort = { name: 1 }
        this.model = mongoose.model('Category', Schema)
        this.fields = 'name description image'
    }
}

module.exports = new Category()