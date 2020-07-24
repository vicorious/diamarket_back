'use strict'
const fs = require('fs')
const csv = require('fast-csv')
const axios = require('axios')

let filesCountries = fs.createReadStream('./files/countries.csv')
let filesStates = fs.createReadStream('./files/states.csv')
let filesCities = fs.createReadStream('./files/cities.csv')
const URL = 'http://localhost:5002/v1/web'
let countries = []
let states = []
let cities = []

ReadCountries()

function ReadCountries () {
  csv
    .fromStream(filesCountries, { headers: true, delimiter: ',' })
    .on('data', async function (data) {
      countries.push(data)
    })
    .on('end', async function () {
      ReadStates()
    })
}

function ReadStates () {
  csv.fromStream(filesStates, { headers: true, delimiter: ',' })
    .on('data', async (data) => {
      states.push(data)
    })
    .on('end', async () => {
      ReadCities()
    })
}

function ReadCities () {
  csv.fromStream(filesCities, { headers: true, delimiter: ',' })
    .on('data', (data) => {
      cities.push(data)
    })
    .on('end', async () => {
      Migrate()
    })
}

async function Migrate () {
  for (let country = 0; country < countries.length; country++) {
    const newCountry = await axios.post(`${URL}/country/create`, { name: countries[country]['name'] })
    console.log(newCountry)
    if (newCountry.data._id) {
      for (let state = 0; state < states.length; state++) {
        if (states[state]['id_country'] === countries[country]['id']) {
          const newState = await axios.post(`${URL}/state/create`, { name: states[state]['name'], country: newCountry.data._id })
          if (newState.data._id) {
            for (let city = 0; city < cities.length; city++) {
              if (cities[city]['id_state'] === states[state]['id']) {
                await axios.post(`${URL}/city/create`, { name: cities[city]['name'], state: newState.data._id })
              }
            }
          }
        }
      }
    }
  }
  console.log('Migración finalizada')
}
