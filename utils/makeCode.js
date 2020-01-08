'use strict'
module.exports = function () {
  let number = ''
  for (let i = 1; i <= 6; i++) {
    const random = Math.floor(Math.random() * 9)
    number += random
  }
  return number
}
