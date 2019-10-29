// GraphQL ROUTES
const graphQLRoute = '/graphql'
const graphiQLRoute = '/graphiql'

// APP ROUTES
const appLoginRootRoute = '/app' // used to login into the application
const allAppRoutes = [appLoginRootRoute, '/user-profile*']

// API AUTH ROUTES
const apiAuthRoutesRoot = '/api/auth'
const registerAndLoginRoute = '/register-and-login'
const loginWithTokenRoute = '/login-with-token'
const loginWithEmailAndPassword = '/login-with-email-and-password'

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