const urlDevelopment = 'https://sandbox.api.payulatam.com/payments-api/4.0/service.cgi'
const urlProduction = 'https://api.payulatam.com/payments-api/4.0/service.cgi'

const urlFinal = urlProduction

module.exports = URL = (
  urlFinal === urlDevelopment
    ? { urlFinal, accountId: 512321, apiKey: '4Vj8eK4rloUd272L48hsrarnUA', apiLogin: 'pRRXKOl8ikMmt9u', merchantId: '508029'}
    : { urlFinal, accountId: 846775, apiKey: 'xryKI4712m8RWNd6Y0uda41rnT', apiLogin: 'g0GIx72ZtuCc0jL', merchantId: '839317'}
)
