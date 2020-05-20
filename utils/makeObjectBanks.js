'use strict'
module.exports = function () {
	const obj = {
		language: 'es',
		command: 'GET_BANKS_LIST',
		merchant: {
			apiKey: 'xryKI4712m8RWNd6Y0uda41rnT',
			apiLogin: 'g0GIx72ZtuCc0jL'
		},
		test: false,
		bankListInformation: {
			paymentMethod: 'PSE',
			paymentCountry: 'CO'
		}
	}
	return obj
}
