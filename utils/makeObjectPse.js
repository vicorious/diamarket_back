const crypto = require('crypto')

module.exports = function (data) {
	console.log(data)
	const signature = crypto.createHash('md5').update(`xryKI4712m8RWNd6Y0uda41rnT~839317~${data.referenceCode}~${data.value}~COP`).digest('hex')
	const obj = {
		language: 'es',
		command: 'SUBMIT_TRANSACTION',
		merchant: {
			apiKey: 'xryKI4712m8RWNd6Y0uda41rnT',
			apiLogin: 'g0GIx72ZtuCc0jL'
		},
		transaction: {
			order: {
				accountId: '846775',
				referenceCode: data.referenceCode,
				description: 'payment test',
				language: 'es',
				signature,
				notifyUrl: 'http://www.tes.com/confirmation',
				additionalValues: {
					TX_VALUE: {
						value: data.value,
						currency: 'COP'
					}
				}
			},
			payer: {
				fullName: data.user.name,
				emailAddress: data.user.email,
				contactPhone: data.user.cellPhone
			},
			extraParameters: {
				RESPONSE_URL: 'http://api.diamarket.co/v1/web/orderservice/responsepayment',
				PSE_REFERENCE1: '127.0.0.1',
				FINANCIAL_INSTITUTION_CODE: data.pseCode,
				USER_TYPE: data.typeClient,
				PSE_REFERENCE2: data.typeDocument,
				PSE_REFERENCE3: data.numberDocument
			},
			type: 'AUTHORIZATION_AND_CAPTURE',
			paymentMethod: 'PSE',
			paymentCountry: 'CO',
			ipAddress: '127.0.0.1',
			cookie: 'pt1t38347bs6jc9ruv2ecpv7o2',
			userAgent: 'Mozilla/5.0 (Windows NT 5.1; rv:18.0) Gecko/20100101 Firefox/18.0'
		},
		test: false
	}
	// const obj = {
	// 	language: 'es',
	// 	command: 'SUBMIT_TRANSACTION',
	// 	merchant: {
	// 		apiKey: 'xryKI4712m8RWNd6Y0uda41rnT',
	// 		apiLogin: 'g0GIx72ZtuCc0jL'
	// 	},
	// 	transaction: {
	// 		order: {
	// 			accountId: '846775',
	// 			referenceCode: data.referenceCode,
	// 			description: 'payment test',
	// 			language: 'es',
	// 			signature,
	// 			notifyUrl: 'http://www.tes.com/confirmation',
	// 			aditionalValues: {
	// 				TX_VALUE: {
	// 					value: data.value,
	// 					urrency: 'COP'
	// 				}
	// 			}
	// 		},
	// 		payer: {
	// 			fullName: data.user.name,
	// 			emailAddress: data.user.email,
	// 			contactPhone: data.user.cellPhone
	// 		},
	// 		extraParameters: {
	// 			RESPONSE_URL: 'http://api.diamarket.co/v1/web/orderservice/responsepayment',
	// 			PSE_REFERENCE1: '127.0.0.1',
	// 			FINANCIAL_INSTITUTION_CODE: data.pseCode,
	// 			USER_TYPE: data.typeClient,
	// 			PSE_REFERENCE2: data.typeDocument,
	// 			PSE_REFERENCE3: data.numberDocument
	// 		},
	// 		type: 'AUTHORIZATION_AND_CAPTURE',
	// 		paymentMethod: 'PSE',
	// 		paymentCountry: 'CO',
	// 		ipAddress: '127.0.0.1',
	// 		cookie: 'pt1t38347bs6jc9ruv2ecpv7o2',
	// 		userAgent: 'Mozilla/5.0 (Windows NT 5.1; rv:18.0) Gecko/20100101 Firefox/18.0'
	// 	},
	// 	test: false
	// }
	return obj
}