const express = require('express')
const router = express.Router()
const fs = require('fs')
const { resolve } = require('path')

let allControllerConfigs = []
fs.readdirSync(__dirname)
    .filter(fileName => fileName !== 'index.js')
    .forEach(fileName => {
        const controllerConfigs = require(resolve(__dirname, fileName)).map(config => ({ ...config, fileName }))
        allControllerConfigs = [ ...allControllerConfigs, ...controllerConfigs]
        controllerConfigs.forEach(({ method = 'get', route, middleware = [], controller }) => {
            router[method](route, middleware, controller)
        })
    })

module.exports = {
    configuredControllers: router,
    controllerConfigs: allControllerConfigs
}

