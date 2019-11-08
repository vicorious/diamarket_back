'use strict'
module.exports = function (errors) {
  let response = {}
  for (var error in errors) {
    const message = errors[error].message
    response[error] = {
      'message': message
    }
  }
  return { errors: response }
}
