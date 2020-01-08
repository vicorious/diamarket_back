'use strict'

const express = require('express')
const asyncify = require('express-asyncify')
const categoryController = require('../controllers/categoryController')
const { convertBase64ToFile } = require('../middleware/convertBase64File')
const { isSuperAdmin, isAdmin, isClient } = require('../middleware/token')
const routesCategoryWeb = asyncify(express.Router())
const routesCategoryApp = asyncify(express.Router())

routesCategoryWeb.post('', convertBase64ToFile, isSuperAdmin, async (request, response) => {
  const create = await categoryController.create(request.body)
  response.json(create)
})

routesCategoryWeb.put('/:id', convertBase64ToFile, isSuperAdmin, async (request, response) => {
  const _id = request.params.id
  const update = await categoryController.update({ _id }, request.body)
  response.json(update)
})

routesCategoryWeb.get('/:id', isSuperAdmin, isAdmin, async (request, response) => {
  const _id = request.params.id
  const detail = await categoryController.detail(_id)
  response.json(detail)
})

routesCategoryWeb.get('', isSuperAdmin, isAdmin, async (request, response) => {
  const all = await categoryController.all()
  response.json(all)
})

routesCategoryApp.get('/:id', isClient, async (request, response) => {
  const _id = request.params.id
  const detail = await categoryController.detail({ _id })
  response.json(detail)
})

routesCategoryApp.get('', isClient, async (request, response) => {
  const all = await categoryController.all()
  response.json(all)
})

module.exports = { routesCategoryWeb, routesCategoryApp }
