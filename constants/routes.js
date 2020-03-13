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

const socialAuthRoot = [apiAuthRoutesRoot, 'social'].join('/')

/*
|--------------------------------------------------------------------------
| Social Auth
|--------------------------------------------------------------------------
*/

const FACEBOOK_LOGIN_CALLBACK_URI = [socialAuthRoot, 'facebook', 'login'].join('/')


module.exports = {
    graphQLRoute,
    graphiQLRoute,
    apiAuthRoutesRoot,
    registerAndLoginRoute,
    loginWithTokenRoute,
    loginWithEmailAndPassword,
    appLoginRootRoute,
    allAppRoutes,
    FACEBOOK_LOGIN_CALLBACK_URI,
}