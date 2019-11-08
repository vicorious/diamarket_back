'use strict'
const crypto = require('crypto')
const secret = 'n%D3qzhr5+sbQU}nzckccCfjtz2g7DfVdZN|]sa*F8K40i"R;PN-Q1c;{7+^'

module.exports = function(password) {
    return crypto.pbkdf2Sync(password, secret, 100000, 64, 'sha512').toString('hex')
}