const mongoose = require('mongoose')
const Base = require('./baseSchema')
const Types = mongoose.Schema.Types

const Schema = mongoose.Schema({
    idSupermarket: {
        type: Types.ObjectId,
        require: [true, 'El supermercado es requerido']
    },
    idProduct: {
        type: Types.ObjectId,
        require: [true, 'EL producto es requerido']
    },
    quantity: {
        type: Types.Number,
        require: [true, 'La cantidad es requerida']
    },
    price: {
        type: Types.Number,
        require: [true, 'El precio es requerido']
    }
})

class Availability extends Base {
    constructor() {
        super()
        this.sort = { quantity: 1 }
        this.model = mongoose.model('Availability', Schema)
        this.fields = 'idSupermarket idProduct quantity price'
        this.populate = [{ path: 'idSupermarket', model: 'Supermarket' }]
        this.populate = [{ path: 'idProduct', model: 'Product' }]
    }
}

module.exports = new Availability()