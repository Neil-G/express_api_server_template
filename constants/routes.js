// GraphQL ROUTES
const graphQLRoute = '/graphql'
const graphiQLRoute = '/graphiql'

// APP ROUTES
const appLoginRootRoute = '/app' // used to login into the application
const allAppRoutes = [appLoginRootRoute, '/user-profile*']

// API AUTH ROUTES
const apiAuthRoutesRoot = '/api/auth'
const registerAndLoginRoute = [apiAuthRoutesRoot, 'register-and-login'].join('/')
const loginWithTokenRoute = [apiAuthRoutesRoot, 'login-with-token'].join('/')
const loginWithEmailAndPassword = [apiAuthRoutesRoot, 'login-with-email-and-password'].join('/')

module.exports = {
    graphQLRoute,
    graphiQLRoute,
    apiAuthRoutesRoot,
    registerAndLoginRoute,
    loginWithTokenRoute,
    loginWithEmailAndPassword,
    appLoginRootRoute,
    allAppRoutes,
}