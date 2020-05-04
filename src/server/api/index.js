const express = require('express')
const bodyParser = require('body-parser')
const https = require('https')
const cors = require('cors')

const { createTwitchRouter } = require('./twitch')

function start({ port, httpsOptions, twitchApi, twitchConfig }) {
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

  app.use('/twitch', createTwitchRouter({ config: twitchConfig, twitchApi }))

  https.createServer(httpsOptions, app).listen(port)
}

module.exports = {
  start,
}
