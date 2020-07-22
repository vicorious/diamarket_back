'use strict'
const AmountsMininumSchema = require('../models/amountsMininumSchema')

class AmountsMininumController {
	async create(data) {
		return AmountsMininumSchema.create(data)
	}

	async detail() {
		const amounts = await AmountsMininumSchema.search()
		return { estado: true, data: amounts[0], mensaje: null }
	}

	async update (data, _id) {
		const amount = await AmountsMininumSchema.update(_id, data)
		return amount
	}

}

module.exports = new AmountsMininumController()
