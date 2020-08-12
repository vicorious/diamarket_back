const SuperMarketSchema = require('../models/supermarketSchema')
const OrderServiceSchema = require('../models/orderServiceSchema')
const UserSchema = require('../models/userSchema')
const CalificationSchema = require('../models/calificationSchema')

class CalificationController {
	async create(data) {
		return CalificationSchema.create(data)
	}

	async detail (data){
		const calification = CalificationSchema.get(data)
		return calification
	}

	async calification (data) {
		const calification = await CalificationSchema.get({ _id: data._id })
		if (calification._id) {
			await CalificationSchema.update(calification._id, { calification: data.calification })
			const califications = await CalificationSchema.search({ calification: { $gte: 0 } })
			let number = 0
			califications.forEach(element => number += parseInt(element.calification))
			number = number / califications.length
			console.log(number)
			await SuperMarketSchema.update(calification.supermarket._id, { calification: parseInt(number) })
			return { estado: true, data: { updated: true }, mensaje: null }
		}
	}
}

module.exports = new CalificationController()