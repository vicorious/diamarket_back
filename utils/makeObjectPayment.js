'use strict'
const crypto = require('crypto')

module.exports = function (data) {
  const signature = crypto.createHash('md5').update(`xryKI4712m8RWNd6Y0uda41rnT~839317~${data.referenceCode}~10000~COP`).digest('hex')
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
        description: 'Compra de diamarket',
        language: 'es',
        signature,
        additionalValues: {
          TX_VALUE: {
            value: 10000,
            currency: 'COP'
          }
        },
        buyer: {
          merchantBuyerId: data.user._id,
          fullName: data.user.name,
          emailAddress: data.user.email,
          contactPhone: data.user.cellPhone ? data.user.cellPhone : 3213213212,
          // dniNumber: data.user.identification ? data.user.identification.toString() : data.user._id.toString()
          dniNumber: data.user.identification ? data.user.identification: 1013692738,
          shippingAddress: {
            street1: data.direction.address,
            street2: data.direction.address,
            city: 'Bogota',
            state: 'Bogota',
            country: 'CO',
            postalCode: '000000',
            phone: data.user.cellPhone ? data.user.cellPhone : 3213213212
          }
        },
        shippingAddress: {
          street1: data.direction.address,
          street2: data.direction.address,
          city: 'Bogota',
          state: 'Bogota',
          country: 'CO',
          postalCode: '000000',
          phone: data.user.cellPhone ? data.user.cellPhone : 3213213212
        }
      },
      payer: {
        merchantBuyerId: data.user._id,
        fullName: data.user.name,
        emailAddress: data.user.email,
        contactPhone: data.user.cellPhone ? data.user.cellPhone : 3213213212,
        // dniNumber: data.user.identification ? data.user.identification.toString() : data.user._id.toString()
        dniNumber: data.user.identification ? data.user.identification : 1013692738,
        billingAddress: {
          street1: data.direction.address,
          street2: data.direction.address,
          city: 'Bogota',
          state: 'Bogota',
          country: 'CO',
          postalCode: '000000',
          phone: data.user.cellPhone ? data.user.cellPhone : 3213213212
        }
      },
      creditCardTokenId: data.card.token,
      type: 'AUTHORIZATION_AND_CAPTURE',
      paymentMethod: data.card.type,
      paymentCountry: "CO",
      deviceSessionId: "vghs6tvkcle931686k1900o6e1",
      ipAddress: "127.0.0.1"
    },
    test: false
  }
  return obj
}