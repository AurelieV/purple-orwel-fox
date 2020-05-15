const express = require('express')
const bodyParser = require('body-parser')
const https = require('https')
const cors = require('cors')
const Issuer = require('openid-client').Issuer

const { createTwitchRouter } = require('./twitch')
const { createAdminRouter } = require('./admin')

function start({ port, httpsOptions, twitchApi, twitchConfig, firebaseApi, foxBot }) {
  const app = express()
  app.use(bodyParser.json({ type: ['text/plain', 'application/json'] }))
  app.use(cors()) // TODO: add whitelist

  let currentTrack = null
  app.post('/music/track', (req, res) => {
    const { ART_NAME, SNG_TITLE } = req.body
    currentTrack = `${SNG_TITLE}, by ${ART_NAME}`
    res.status(200).send('OK')
  })
  app.get('/music/track', (req, res) => {
    res.json({ track: currentTrack })
  })

  app.use('/twitch', createTwitchRouter({ config: twitchConfig, twitchApi, firebaseApi }))
  app.use('/admin', createAdminRouter({ firebaseApi, twitchApi }))

  https.createServer(httpsOptions, app).listen(port)
}

module.exports = {
  start,
}
