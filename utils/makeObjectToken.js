'use strict'

module.exports = function (card) {
  const obj = {
		language: 'es',
		command: 'CREATE_TOKEN',
		merchant: {
			apiLogin: 'g0GIx72ZtuCc0jL',
			apiKey: 'xryKI4712m8RWNd6Y0uda41rnT'
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