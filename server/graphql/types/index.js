const fs = require('fs')
const { resolve } = require('path')

let combinedTypes = {}
fs.readdirSync(__dirname)
  .filter(fileName => !['index.js', 'utils.js'].includes(fileName))
  .forEach(fileName => {
    const TypeName = fileName.split('.')[0]
    combinedTypes[TypeName] = require(resolve(__dirname, fileName))
})

module.exports = combinedTypes