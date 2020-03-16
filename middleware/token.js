'use strict'
const jwt = require('jsonwebtoken')
const UserSchema = require('../models/userSchema')
const SECRET = 'Cb6t%5UpGtx-G@jUM[RG~Aei8k8MKStC]=}pBlIT:C-9jr2{8fVaLZNUmqt%'

async function isSuperAdmin (request, response, next) {
  if (!request.User) {
    const authorization = request.headers.authorization
    if (authorization) {
      const token = authorization.split(' ')[1]
      try {
        const verify = await jwt.verify(token, SECRET)
        const id = verify._id
        const user = await UserSchema.get({ _id: id, rol: 'superadministrator' })
        if (user._id) {
          request.User = { id, rol: user.rol }
          return next()
        }
      } catch (TokenExpiredError) {}
    }
    response.send({ estado: false, data: [], mensaje: 'Las credenciales de autenticación no se proveyeron.' })
  } else {
    return next()
  }
}

async function isAdmin (request, response, next) {
  if (!request.User) {
    console.log('hola')
    const authorization = request.headers.authorization
    console.log('autorizacion', authorization)
    if (authorization) {
      const token = authorization.split(' ')[1]
      try {
        const verify = await jwt.verify(token, SECRET)
        const id = verify._id
        const user = await UserSchema.get({ _id: id, rol: 'administrator' })
        if (user._id) {
          request.User = { id, rol: user.rol }
          return next()
        }
      } catch (TokenExpiredError) {}
    }
    response.send({ estado: false, data: [], mensaje: 'Las credenciales de autenticación no se proveyeron.' })
  } else {
    return next()
  }
}

async function isDomiciliary (request, response, next) {
  if (!request.User) {
    const authorization = request.headers.authorization
    if (authorization) {
      const token = authorization.split(' ')[1]
      try {
        const verify = await jwt.verify(token, SECRET)
        const id = verify._id
        const user = await UserSchema.get({ _id: id, rol: 'domiciliary' })
        if (user._id) {
          request.User = { id, rol: user.rol }
          return next()
        }
      } catch (TokenExpiredError) {}
    }
    response.send({ estado: false, data: [], mensaje: 'Las credenciales de autenticación no se proveyeron.' })
  } else {
    return next()
  }
}

async function isClient (request, response, next) {
  if (!request.User) {
    const authorization = request.headers.authorization
    if (authorization) {
      const token = authorization.split(' ')[1]
      try {
        const verify = await jwt.verify(token, SECRET)
        const id = verify._id
        const user = await UserSchema.get({ _id: id, rol: 'client' })
        if (user._id) {
          request.User = { id, rol: user.rol }
          return next()
        }
      } catch (TokenExpiredError) {}
    }
    response.send({ error: 'Las credenciales de autenticación no se proveyeron.' })
  } else {
    return next()
  }
}

async function isAdminAndIsSuperAdmin (request, response, next) {
  if (!request.User) {
    const authorization = request.headers.authorization
    if (authorization) {
      const token = authorization.split(' ')[1]
      try {
        const verify = await jwt.verify(token, SECRET)
        const id = verify._id
        const userSuperAdmin = await UserSchema.get({ _id: id, rol: 'superadministrator' })
        const userAdmin = await UserSchema.get({ _id: id, rol: 'administrator' })
        if (userSuperAdmin._id) {
          request.User = { id, rol: userSuperAdmin.rol }
          return next()
        } else if (userAdmin._id) {
          request.User = { id, rol: userAdmin.rol }
          return next()
        }
      } catch (TokenExpiredError) {}
    }
    response.send({ error: 'Las credenciales de autenticación no se proveyeron.' })
  } else {
    return next()
  }
}

async function isSuperAdminAndIsAdminAndIsDomiciliary (request, response, next) {
  if (!request.User) {
    const authorization = request.headers.authorization
    if (authorization) {
      const token = authorization.split(' ')[1]
      try {
        const verify = await jwt.verify(token, SECRET)
        const id = verify._id
        const userSuperAdmin = await UserSchema.get({ _id: id, rol: 'superadministrator' })
        const userAdmin = await UserSchema.get({ _id: id, rol: 'administrator' })
        const userDomiciliary = await UserSchema.get({ _id: id, rol: 'domiciliary' })
        if (userSuperAdmin._id) {
          request.User = { id, rol: userSuperAdmin.rol }
          return next()
        } else if (userAdmin._id) {
          request.User = { id, rol: userAdmin.rol }
          return next()
        } else {
          request.User = { id, rol: userDomiciliary.rol }
        }
      } catch (TokenExpiredError) {}
    }
    response.send({ error: 'Las credenciales de autenticación no se proveyeron.' })
  } else {
    return next()
  }
}

module.exports = { isSuperAdmin, isAdmin, isDomiciliary, isClient, isAdminAndIsSuperAdmin, isSuperAdminAndIsAdminAndIsDomiciliary }
