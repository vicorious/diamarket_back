'use strict'
module.exports = function () {
  let uniqueCode = ''
  const possible = '0123456789'
  for (var i = 0; i < 6; i++) {
    uniqueCode += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return uniqueCode
}
