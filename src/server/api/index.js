const express = require('express')
const bodyParser = require('body-parser')
const https = require('https')
const cors = require('cors')
const Issuer = require('openid-client').Issuer

const { createTwitchRouter } = require('./twitch')
const { createQueueRouter } = require('./queue')

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
  app.get('/test/:login', async (req, res) => {
    try {
      const data = await twitchApi.getUserByLogin(req.params.login)
      res.json({ user: data })
    } catch (err) {
      console.log('Error', err)
      res.status('500').send('Oups')
    }
  })
  app.post('/admin/login', async (req, res) => {
    const code = req.body.code
    if (!code) {
      return res.status('400').json({ error: 'Fields missing' })
    }
    try {
      const { token, user } = await twitchApi.processOidcCode(code)
      return res.json({ token, user })
    } catch (e) {
      console.log('error', e)
      res.status('500').json({ err: 'Something wrong happen' })
    }
  })

  app.use('/twitch', createTwitchRouter({ config: twitchConfig, twitchApi, firebaseApi }))
  app.use('/queue', createQueueRouter({ firebaseApi, twitchApi }))

  https.createServer(httpsOptions, app).listen(port)
}

module.exports = {
  start,
}
