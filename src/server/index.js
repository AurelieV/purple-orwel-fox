const fs = require('fs')
const path = require('path')

const { start: startAPI } = require('./api')
const { start: startBot } = require('./bot')
const { FoxApi } = require('./services/fox-api')
const { TwitchApi } = require('./services/twitch-api')

const botConfig = require('../../config/bot.config')
const twitchConfig = require('../../config/twitch.config')
const httpsOptions = {
  key: fs.readFileSync(path.resolve(__dirname, '../../config/cert/server.key')),
  cert: fs.readFileSync(path.resolve(__dirname, '../../config/cert/server.crt')),
}
const apiPath = 'https://localhost:3000' // TODO: move this to a config file

const foxApi = new FoxApi({ apiPath })
const twitchApi = new TwitchApi({ config: twitchConfig })

startAPI({ port: 3000, httpsOptions, twitchApi, twitchConfig })
startBot({ config: botConfig, foxApi })
