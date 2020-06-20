const express = require('express')
const { MAX_QUEUE_ERROR, ALREADY_IN_QUEUE } = require('../../services/firebase-api')

function createQueueRouter({ firebaseApi, twitchApi }) {
  const router = new express.Router()

  router.delete('/:channelId/:itemId', async (req, res) => {
    const { channelId, itemId } = req.params
    if (channelId !== req.uid) {
      return res.status(403).send()
    }
    try {
      await firebaseApi.deleteFromQueue(channelId, itemId)
      res.status(200).send()
    } catch (err) {
      console.log('Err', err)
      res.status(500).send()
    }
  })

  router.patch('/:channelId/:itemId/active', async (req, res) => {
    const { channelId, itemId } = req.params
    if (channelId !== req.uid) {
      return res.status(403).send()
    }
    const { value } = req.body
    try {
      await firebaseApi.changeQueueItemState(channelId, itemId, !!value)
      res.status(200).send()
    } catch (err) {
      console.log('Err', err)
      res.status(500).send()
    }
  })

  router.post('/:channelId/message', async (req, res) => {
    const { channelId } = req.params
    const { message } = req.body
    if (channelId !== req.uid) {
      return res.status(403).send()
    }
    try {
      const { userIds, messageId } = await firebaseApi.addMessage(channelId, message)
      await twitchApi.broadCastMessage(
        {
          type: 'NEW_MESSAGE',
          payload: { userIds, messageId },
        },
        channelId
      )
      res.status(200).send()
    } catch (err) {
      console.log('Err', err)
      res.status(500).send()
    }
  })

  router.get('/:channelId/my-messages', async (req, res) => {
    const { channelId } = req.params
    try {
      const messages = await firebaseApi.getMessages(channelId)
      const userMessages = messages
        .filter(({ userIds }) => userIds.includes(req.uid))
        .map(({ value }) => value)
      res.json({ messages: userMessages })
    } catch (err) {
      console.log('err', err)
      res.status(500).send()
    }
  })

  router.post('/:channelId/join', async (req, res) => {
    const { channelId } = req.params
    try {
      const user = await twitchApi.getUserById(req.uid)
      const position = await firebaseApi.joinQueue(channelId, user)
      res.json({ position })
    } catch (err) {
      console.log(err)
      if (err === MAX_QUEUE_ERROR) {
        return res.status(400).json({ message: 'MAX_QUEUE_ERROR' })
      }
      if (err === ALREADY_IN_QUEUE) {
        return res.status(403).send()
      }
      res.status(500).send()
    }
  })

  router.post('/:channelId/leave', async (req, res) => {
    const { channelId } = req.params
    try {
      const queue = await firebaseApi.getQueue(channelId)
      const item = (queue || []).find(({ user }) => user.id === req.uid)
      if (!item) {
        return res.status(400).send()
      }
      await firebaseApi.deleteFromQueue(channelId, item.id)
      res.send()
    } catch (err) {
      console.log(err)
      res.status(500).send()
    }
  })

  return router
}

module.exports = {
  createQueueRouter,
}
