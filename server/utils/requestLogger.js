const chalk = require('chalk')

module.exports = (req, _, next) => {
    if (req.path.includes('api')) {
      console.log(chalk.magenta(`${req.method} ${req.path}`))
      return next()
    }
    if (req.path.includes('graphql')) {
      console.log(chalk.green(`${req.method} ${req.path}`))
      return next()
    }
    if (req.path.includes('.css') || req.path.includes('.ico')) {
      console.log(chalk.blueBright(`${req.method} ${req.path}`))
      return next()
    }
    console.log(chalk.yellow(`${req.method} ${req.path}`))
    next()
  }