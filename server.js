// Core dependencies
const fs = require('fs')
const PORT = process.env.PORT || 5000

// NPM dependencies
const express = require('express')
const startRoute = require('./routes/start')
const removedPropertyCheckRoute = require('./routes/removed-property-check')
const path = require('path')
const nunjucks = require('nunjucks')
const sessionInMemory = require('express-session')

// Local dependencies
const config = require('./app/src/config.js')
const utils = require('./lib/utilities/utils.js')

// Configuration variables
var useAutoStoreData = process.env.USE_AUTO_STORE_DATA || config.useAutoStoreData

//var isSecure = (env === 'production' && useHttps === 'true')
// PLACEHOLDER SET TO TRUE - REVIEW CODE IN PROTOTYPE
var isSecure = true

const app = express()

app.use(express.static('dist'))
// Redirect any asset requests to the relevant location in the gov uk frontend kit
app.use('/assets', express.static('./node_modules/govuk-frontend/govuk/assets'))

app.set('views','./app/views');

// Nunjucks config
app.set("view engine", "html")

var nunjucksAppEnv = nunjucks.configure([
  "node_modules/govuk-frontend/",
  'app/views/'
],
{
  autoescape: false,
  express: app,
  watch:true
})

// Add variables that are available in all views
app.locals.serviceName = config.serviceName

// Session uses service name to avoid clashes with other prototypes
const sessionName = 'row-' + (Buffer.from(config.serviceName, 'utf8')).toString('hex')
const sessionOptions = {
  secret: sessionName,
  cookie: {
    maxAge: 1000 * 60 * 60 * 4, // 4 hours
    secure: isSecure
  }
}

// Support session data in memory
app.use(sessionInMemory(Object.assign(sessionOptions, {
  name: sessionName,
  resave: false,
  saveUninitialized: false
})))

if (useAutoStoreData === 'true') {
  app.use(utils.autoStoreData)
  utils.addCheckedFunction(nunjucksAppEnv)
}

// Routes - may need importing from a main 'routes' script, rather than individually?
app.use('/', startRoute)
app.use('/removed-property-check', removedPropertyCheckRoute)
        
app.listen(PORT, () => {
    console.log(`App listening on ${PORT} - url: http://localhost:${PORT}`)
    console.log('Press Ctrl+C to quit.')
})
