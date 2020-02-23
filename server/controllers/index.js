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
                if (config.inputSchema) {
                    config.middleware.unshift(celebrate(config.inputSchema, { allowUnknown: true }))
                    config.celebrateString = Object.keys(config.inputSchema).map(segment => {
                        const description = config.inputSchema[segment].describe()
                        let validationDescriptionArray = [segment.toUpperCase(), description.type]
                        if (description.children) {
                            Object.entries(description.children).forEach(([ key, value ]) => {
                                validationDescriptionArray.push(`{${key}: ${value.type} (${Object.values(value.flags).join(', ')})}`)
                            })
                        }
                        return validationDescriptionArray.join(' ')
                    }).join('\n')
                }
                if (config.outputSchema) {
                    config.outputSchemaString = ''
                    const outputSchema = config.outputSchema.describe()
                    Object.entries(outputSchema.children).forEach(([ key, { type }]) => {
                        config.outputSchemaString += `{${key}: ${type}} `
                    })
                }
                return config
            })
        controllerConfigs = [ ...controllerConfigs, ...fileControllerConfigs]
        fileControllerConfigs.forEach(({ method, route, middleware, controller, outputSchema }) => {
            configuredControllersRouter[method](route, middleware, async (req, res) => { 
                try {
                    const outputData = await controller(req)
                    const { value, error } = outputSchema.validate(outputData)
                    if (error) throw Error(error)
                    return res.send(value)
                } catch (error) {
                    console.log(error)
                    res.status(400).send(error)
                }
            })
        })
    })

module.exports = {
    configuredControllersRouter,
    controllerConfigs
}

