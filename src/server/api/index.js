const express = require('express')
const bodyParser = require('body-parser')
const https = require('https')
const cors = require('cors')
const Issuer = require('openid-client').Issuer

const { createTwitchRouter } = require('./twitch')
const { createAdminRouter } = require('./admin')
const { createChromeRouter } = require('./chrome')

function start({ port, httpsOptions, twitchApi, twitchConfig, firebaseApi, foxConfig, dbApi }) {
  const app = express()
  app.use(bodyParser.json({ type: ['text/plain', 'application/json'] }))
  app.use(cors()) // TODO: add whitelist

  app.use('/twitch', createTwitchRouter({ config: twitchConfig, twitchApi, firebaseApi }))
  app.use('/admin', createAdminRouter({ firebaseApi, twitchApi, dbApi }))
  app.use('/chrome', createChromeRouter({ firebaseApi, twitchApi, foxConfig }))

  https.createServer(httpsOptions, app).listen(port)
}

module.exports = {
  start,
}
