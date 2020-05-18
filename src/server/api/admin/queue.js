const express = require('express')

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

  return router
}

module.exports = {
  createQueueRouter,
}
