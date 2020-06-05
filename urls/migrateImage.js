const express = require('express')
const asyncify = require('express-asyncify')
const migrationImageRoute = asyncify(express.Router())

migrationImageRoute.get('', async (request, response) => {
	
})

module.exports = { migrationImageRoute }