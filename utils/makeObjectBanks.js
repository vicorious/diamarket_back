'use strict'
const crypto = require('crypto')
const MakeDataPayU = require('./makeDataPayU')

module.exports = function () {
	const obj = {
		language: 'es',
		command: 'GET_BANKS_LIST',
		merchant: {
			apiKey: MakeDataPayU.apiKey,
			apiLogin: MakeDataPayU.apiLogin
		},
		test: false,
		bankListInformation: {
			paymentMethod: 'PSE',
			paymentCountry: 'CO'
		}
	}
	return obj
}
