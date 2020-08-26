const SuperMarketSchema = require('../models/supermarketSchema')
const OrderServiceSchema = require('../models/orderServiceSchema')
const UserSchema = require('../models/userSchema')
const CalificationSchema = require('../models/calificationSchema')

class CalificationController {
	async create(data) {
		return CalificationSchema.create(data)
	}

	async detail (data){
		const calification = await CalificationSchema.get(data)
		if (calification._id) {
			if (calification.orderService.status === 4) {
				return { estado: true, data: calification, mensaje: null}
			} else {
				return { estado: false, data: [], mensaje: 'no hay calificaciones' }
			}
		} else {
			return { estado: false, data: [], mensaje: 'no hay calificaciones' }
		}
	}

	async calification (data) {
		const calification = await CalificationSchema.get({ _id: data._id })
		if (calification._id) {
			await CalificationSchema.update(calification._id, { calification: data.calification, show: false })
			const califications = await CalificationSchema.search({supermarket: calification.supermarket._id, calification: { $gte: 0 } })
			let number = 0
			califications.forEach(element => number += parseInt(element.calification))
			number = number / califications.length
			await SuperMarketSchema.update(calification.supermarket._id, { calification: parseInt(number) })
			return { estado: true, data: { updated: true }, mensaje: null }
		}
	}

	async update (_id, data) {
		const calification = await CalificationSchema.get({ _id })
		console.log(calification)
		if (calification._id) {
			const update = await CalificationSchema.update(calification._id, data)
			console.log(update)
			return { estado: true, data: update, mensaje: null }
		} else {
			return { estado: false, data: [], mensaje: 'No exite' }
		}
	}
}

module.exports = new CalificationController()