const fs = require('fs')
const path = require('path')
const firebaseAdmin = require('firebase-admin')

const { start: startAPI } = require('./api')
const { FoxBot } = require('./bot')
const { TwitchApi } = require('./services/twitch-api')
const { FirebaseApi } = require('./services/firebase-api')

const botConfig = require('../../config/bot.config')
const twitchConfig = require('../../config/twitch.config')
const firebaseConfig = require('../../config/firebase.config.json')
const foxConfig = require('../../config/fox.config')

const httpsOptions = {
  key: fs.readFileSync(path.resolve(__dirname, '../../config/cert/server.key')),
  cert: fs.readFileSync(path.resolve(__dirname, '../../config/cert/server.crt')),
} // TODO: move this to a config file

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(firebaseConfig),
  databaseURL: 'https://purplefox-9131f.firebaseio.com',
})

const firebaseApi = new FirebaseApi({ db: firebaseAdmin.firestore() })
const twitchApi = new TwitchApi({
  config: twitchConfig,
  firebaseApi,
})
const bot = new FoxBot({ config: botConfig, firebaseApi, twitchApi })

bot.start()
startAPI({
  port: 3000,
  httpsOptions,
  twitchApi,
  twitchConfig,
  firebaseApi,
  foxConfig,
})
