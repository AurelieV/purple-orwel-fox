const fs = require('fs')
const path = require('path')
const firebaseAdmin = require('firebase-admin')

const { start: startAPI } = require('./api')
const { FoxBot } = require('./bot')
const { FoxApi } = require('./services/fox-api')
const { TwitchApi } = require('./services/twitch-api')
const { FirebaseApi } = require('./services/firebase-api')

const botConfig = require('../../config/bot.config')
const twitchConfig = require('../../config/twitch.config')
const firebaseConfig = require('../../config/firebase.config.json')
const httpsOptions = {
  key: fs.readFileSync(path.resolve(__dirname, '../../config/cert/server.key')),
  cert: fs.readFileSync(path.resolve(__dirname, '../../config/cert/server.crt')),
}
const apiPath = 'https://localhost:3000' // TODO: move this to a config file

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(firebaseConfig),
  databaseURL: 'https://purplefox-9131f.firebaseio.com',
})

const firebaseApi = new FirebaseApi({ db: firebaseAdmin.firestore() })
const twitchApi = new TwitchApi({
  config: twitchConfig,
  firebaseApi,
  firebaseAuth: firebaseAdmin.auth(),
})
const bot = new FoxBot({ config: botConfig, firebaseApi, twitchApi })
const foxApi = new FoxApi({ apiPath, firebaseApi, bot })

bot.start({ foxApi })
startAPI({ port: 3000, httpsOptions, twitchApi, twitchConfig, firebaseApi, foxBot: bot })
