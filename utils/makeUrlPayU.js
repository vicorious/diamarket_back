// const urlDevelopment = 'https://sandbox.api.payulatam.com/payments-api/4.0/service.cgi'
// const urlProduction = 'https://api.payulatam.com/payments-api/4.0/service.cgi'
const urlDevelopment = 'https://sandbox.api.payulatam.com/payments-api/4.0/service.cgi'
const urlProduction = 'https://api.payulatam.com/payments-api/4.0/service.cgi'

const urlFinal = urlProduction

module.exports = URL = (
  urlFinal === urlDevelopment
    ? urlDevelopment
    : urlProduction
)
