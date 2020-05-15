const express = require('express')
const { createQueueRouter } = require('./queue')

function createAdminRouter({ firebaseApi, twitchApi }) {
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

  router.use('/queue', createQueueRouter({ firebaseApi, twitchApi }))
  return router
}

module.exports = {
  createAdminRouter,
}
