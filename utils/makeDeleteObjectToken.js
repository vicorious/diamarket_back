'use strict'

module.exports = function(_id, token) {
	const obj = {
		language : 'es',
		command: 'REMOVE_TOKEN',
		merchant: {
			apiLogin: 'g0GIx72ZtuCc0jL',
			apiKey: 'xryKI4712m8RWNd6Y0uda41rnT'
		},
		removeCreditCardToken: {
			payerId: _id,
			creditCardTokenId: token
		}
	}
	return obj
}