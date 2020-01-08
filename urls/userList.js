'use strict'
const express = require('express')
const asyncify = require('express-asyncify')
const routesUserListApp = asyncify(express.Router())
const UserListController = require('../controllers/userListController')
const { isClient } = require('../middleware/token')

routesUserListApp.post('', isClient, async (request, response) => {
  request.body.user = request.User.id
  const data = request.body
  const create = await UserListController.create(data)
  response.json(create)
})
routesUserListApp.put('/:id', isClient, async (request, response) => {
  const id = request.paramas.id
  const data = request.body
  const update = await UserListController.update(id, data)
  response.json(update)
})
routesUserListApp.get('', isClient, async (request, response) => {
  const user = request.User.id
  const search = await UserListController.all({ user })
  response.json(search)
})
routesUserListApp.get('/:id', isClient, async (request, response) => {
  const _id = request.params.id
  const detail = await UserListController.detail({ _id })
  response.json(detail)
})

module.exports = { routesUserListApp }
