'use strict'
const jwt = require('jsonwebtoken')
const userController = require('../controllers/userController')
const SECRET = 'Cb6t%5UpGtx-G@jUM[RG~Aei8k8MKStC]=}pBlIT:C-9jr2{8fVaLZNUmqt%'

async function token(request, response, next) {
    const authorization = request.headers.authorization
    if (authorization) {
        const token = authorization.split(' ')[1]
        try {
            const verify = await jwt.verify(token, SECRET)
            const id = verify._id
            const dataUser = await userController.detail({ _id: id })
            if (dataUser.data._id) {
                request.user = { id, rol: dataUser.data.rol }
                return next()
            } else {
                response.send({ estado: false, data: [], mensaje: 'Las credenciales de autenticación no se proveyeron.' })
            }
        } catch (TokenExpiredError) {}
    }
    response.send({ estado: false, data: [], mensaje: 'Las credenciales de autenticación no se proveyeron.' })
}

module.exports = token