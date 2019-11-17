const express = require('express')
const router = express.Router()
const fs = require('fs')
const { resolve, basename } = require('path')

let allControllerConfigs = []
fs.readdirSync(__dirname)
  .filter(filename => filename !== basename(__filename))
    .forEach(filename => {
        const controllerConfigs = require(resolve(__dirname, filename)).map(config => ({ ...config, filename }))
        allControllerConfigs = [ ...allControllerConfigs, ...controllerConfigs]
        controllerConfigs.forEach(({ method = 'get', route, middleware = [], controller }) => {
            router[method](route, middleware, controller)
        })
    })

module.exports = {
    configuredControllers: router,
    controllerConfigs: allControllerConfigs
}

