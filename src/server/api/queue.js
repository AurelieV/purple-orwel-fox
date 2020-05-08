const express = require('express')

function createQueueRouter({ firebaseApi, foxBot }) {
  const router = new express.Router()

  router.delete('/:channelId/:itemId', async (req, res) => {
    const { channelId, itemId } = req.params
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
    try {
      const activeItems = await firebaseApi.getActiveQueueItems(channelId)
      const logins = activeItems.map(({ login }) => login)
      console.log(message, logins)
      await foxBot.sendMessageTo(message, logins)
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
