const express = require('express')
const jsonwebtoken = require('jsonwebtoken')

function createTwitchRouter({ config, twitchApi, firebaseApi }) {
  const router = new express.Router()

  router.use((req, res, next) => {
    const authHeader = req.header('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).send()
    }
    try {
      const token = authHeader.replace('Bearer ', '') // cradou
      const {
        channel_id: channelId,
        opaque_user_id: opaqueUserId,
        user_id: userId,
      } = jsonwebtoken.verify(token, Buffer.from(config.clientSecret, 'base64'), {
        algorithms: ['HS256'],
      })
      req.channelId = channelId
      req.opaqueUserId = opaqueUserId
      req.userId = userId
      next()
    } catch (err) {
      console.log('err', err)
      res.status(401).send()
    }
  })

  router.post('/hello', async (req, res) => {
    try {
      await twitchApi.broadCastMessage(
        { type: 'hello', origin: req.opaqueUserId, payload: 'Hello' },
        req.channelId
      )
      res.status(200).send()
    } catch (err) {
      console.log('Err', err)
      res.status(500).send()
    }
  })

  router.get('/:channelId/message/:messageId', async (req, res) => {
    const { channelId, messageId } = req.params
    if (req.channelId !== channelId || !req.userId) {
      return res.status(401).send()
    }
    try {
      const message = await firebaseApi.getMessage(channelId, messageId)
      const isAuthorized = (message.userIds || []).some((id) => id === req.userId)
      if (!isAuthorized) {
        return res.status(403).send()
      }
      return res.json({ message: message.value })
    } catch {
      res.status(404).send()
    }
  })

  return router
}

module.exports = {
  createTwitchRouter,
}
