const express = require('express')
const configuredControllersRouter = express.Router()
const fs = require('fs')
const { resolve, basename } = require('path')
const { celebrate } = require('celebrate');

let controllerConfigs = []
fs.readdirSync(__dirname)
  .filter(filename => filename !== basename(__filename))
    .forEach(filename => {
        // augment controller configs
        const fileControllerConfigs = require(resolve(__dirname, filename))
            .map(config => {
                config.filename = filename
                config.method = config.method || 'get'
                config.output = config.output || ''
                config.middleware = config.middleware || []
                config.middlewareString = config.middleware.map(method => method.name).join(', ')
                // TODO: extract celebration validation formatter method
                config.celebrateString = ''
                if (config.celebrate) {
                    config.middleware.unshift(celebrate(config.celebrate, { allowUnknown: true }))
                    config.celebrateString = Object.keys(config.celebrate).map(segment => {
                        const description = config.celebrate[segment].describe()
                        let validationDescriptionArray = [segment.toUpperCase(), description.type]
                        if (description.children) {
                            Object.entries(description.children).forEach(([ key, value ]) => {
                                validationDescriptionArray.push(`{${key}: ${value.type} (${Object.values(value.flags).join(', ')})}`)
                            })
                        }
                        return validationDescriptionArray.join(' ')
                    }).join('\n')
                }
                return config
            })
        controllerConfigs = [ ...controllerConfigs, ...fileControllerConfigs]
        fileControllerConfigs.forEach(({ method, route, middleware, controller }) => {
            configuredControllersRouter[method](route, middleware, controller)
        })
    })

module.exports = {
    configuredControllersRouter,
    controllerConfigs
}

