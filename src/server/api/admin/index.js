const express = require('express')
const { createQueueRouter } = require('./queue')

function createAdminRouter({ firebaseApi, twitchApi, dbApi }) {
  const router = new express.Router()

  router.post('/login', async (req, res) => {
    const code = req.body.code
    if (!code) {
      return res.status('400').json({ error: 'Fields missing' })
    }
    try {
      const user = await twitchApi.processOidcCode(code)
      const token = await firebaseApi.createToken(user)
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
      const decodeToken = await firebaseApi.verifyIdToken(token)
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

  router.post('/favorite', async (req, res) => {
    const channelId = req.body.channelId
    try {
      const favorites = await dbApi.addUserFavorite(req.uid, channelId)
      res.send({ favorites })
    } catch {
      res.status(500).send()
    }
  })

  router.delete('/favorite', async (req, res) => {
    const channelId = req.body.channelId
    try {
      const favorites = await dbApi.removeUserFavorite(req.uid, channelId)
      res.send({ favorites })
    } catch {
      res.status(500).send()
    }
  })

  router.get('/me', async (req, res) => {
    try {
      const info = await dbApi.getUserById(req.uid)
      res.send(info)
    } catch (err) {
      console.log('err', err)
      res.status(500).send()
    }
  })

  router.get('/channel/:channelId', async (req, res) => {
    const channelId = req.params.channelId
    if (!channelId) {
      return res.status(400).send('Missing channelId')
    }
    try {
      const info = await twitchApi.getUserById(channelId)
      res.send(info)
    } catch (err) {
      res.status(err.response.status === 404 ? 404 : 500).send()
      console.log(err.response)
    }
  })

  router.get('/channel', async (req, res) => {
    const channelIds = (req.query.channelIds || '').split(',')
    if (channelIds.length === 0) {
      return res.status(400).send('Missing channelsId')
    }
    try {
      const info = await twitchApi.getUsersById(channelIds)
      res.send(info)
    } catch (err) {
      res.status(err.response.status === 404 ? 404 : 500).send()
      console.log(err.response.data)
    }
  })

  router.use('/queue', createQueueRouter({ firebaseApi, twitchApi }))
  return router
}

module.exports = {
  createAdminRouter,
}
