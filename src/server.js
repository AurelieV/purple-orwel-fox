const express = require('express')
const bodyParser = require('body-parser')

function start() {
  const app = express()
  app.use(bodyParser.json({ type: 'text/plain' }))

  let currentSong = null
  app.post('/music/track', (req, res) => {
    const { ART_NAME, SNG_TITLE } = req.body
    currentSong = `${SNG_TITLE}, by ${ART_NAME}`
    res.status(200).send('OK')
  })

  app.listen(3000, () => {
    console.log('Server start on localhost:3000')
  })

  return {
    getCurrentSong() {
      return currentSong
    },
  }
}

module.exports = {
  start,
}
