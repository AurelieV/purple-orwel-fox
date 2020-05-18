const express = require('express')
const { createQueueRouter } = require('./queue')

function createAdminRouter({ firebaseApi, twitchApi, firebaseAuth }) {
  const router = new express.Router()

  router.post('/login', async (req, res) => {
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

  router.use(async (req, res, next) => {
    const authHeader = req.header('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).send()
    }
    try {
      const token = authHeader.replace('Bearer ', '') // cradou
      const decodeToken = await firebaseAuth.verifyIdToken(token)
      req.uid = decodeToken.uid
      next()
    } catch (err) {
      res.status(401).send()
    }
  })

  router.post('/:channelId/punt/reset', async (req, res) => {
    const channelId = req.params.channelId
    if (channelId !== req.uid) {
      return res.status(403).send()
    }
    try {
      await firebaseApi.resetPunt(channelId)
      res.send()
    } catch {
      res.status(500).send()
    }
  })

  router.use('/queue', createQueueRouter({ firebaseApi, twitchApi }))
  return router
}

module.exports = {
  createAdminRouter,
}
