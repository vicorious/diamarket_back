'use strict'
const MakeDataPayU = require('./makeDataPayU')

module.exports = function (card) {
  const obj = {
		language: 'es',
		command: 'CREATE_TOKEN',
		merchant: {
			apiLogin: MakeDataPayU.apiLogin,
			apiKey: MakeDataPayU.apiKey
		},
		creditCardToken: {
			payerId: card._id,
			name: card.name,
			identificationNumber: card.identification,
			paymentMethod: card.type,
			number: card.number,
			expirationDate: card.expirationDate
		}
	}
	return obj
}