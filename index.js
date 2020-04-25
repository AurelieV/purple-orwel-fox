const { start: startServer } = require('./src/server')
const { start: startBot } = require('./src/bot')

const { getCurrentSong } = startServer()
startBot({ getCurrentSong })
