const express = require('express')
const jsonwebtoken = require('jsonwebtoken')

function createChromeRouter({ firebaseApi, twitchApi, foxConfig }) {
  const router = new express.Router()

  router.post('/login', async (req, res) => {
    const code = req.body.code
    if (!code) {
      return res.status('400').json({ error: 'Fields missing' })
    }
    try {
      const user = await twitchApi.processOidcCode(code)
      const token = jsonwebtoken.sign({ user }, Buffer.from(foxConfig.clientSecret, 'base64'), {
        algorithm: 'HS256',
      })
      return res.json({ token, user })
    } catch (e) {
      console.log('error', e)
      res.status(500).json({ err: 'Something wrong happen' })
    }
  })

  router.use(async (req, res, next) => {
    const authHeader = req.header('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).send()
    }
    try {
      const token = authHeader.replace('Bearer ', '') // cradou
      const { user } = jsonwebtoken.verify(token, Buffer.from(foxConfig.clientSecret, 'base64'), {
        algorithms: ['HS256'],
      })
      req.user = user
      next()
    } catch (err) {
      res.status(401).send()
    }
  })

  router.post('/:channelId/track', async (req, res) => {
    const user = req.user
    const channelId = req.params.channelId
    if (user.id !== channelId) {
      return res.status(403).send()
    }
    const { ART_NAME, SNG_TITLE } = req.body
    const currentTrack = `${SNG_TITLE}, by ${ART_NAME}`
    try {
      await firebaseApi.setTrack(channelId, currentTrack)
      res.send('OK')
    } catch {
      res.status(500).send()
    }
  })

  return router
}

module.exports = {
  createChromeRouter,
}
