const tmi = require('tmi.js')
const { MAX_QUEUE_ERROR, ALREADY_IN_QUEUE } = require('../services/firebase-api')

class FoxBot {
  constructor({ config, firebaseApi, twitchApi }) {
    this.config = config
    this.firebaseApi = firebaseApi
    this.twitchApi = twitchApi
  }

  async start({ foxApi }) {
    this.foxApi = foxApi
    const client = new tmi.client(this.config)

    client.on('message', (...data) => this.onMessageHandler(...data))
    client.on('connected', async () => {
      await client.say(this.config.channels[0], 'Le renard est dans la place!')
      console.log('Fox is in place')
    })
    client.connect()
    this.client = client
  }

  async getSong({ channel }) {
    try {
      const track = await this.foxApi.getCurrentTrack()
      if (track) {
        this.client.say(channel, `Actuellement à l'écoute: ${track}`)
      } else {
        this.client.say(channel, "Je ne sais pas :'(")
      }
    } catch (err) {
      console.log(err)
      this.client.say(channel, "Oups, j'ai planté")
    }
  }

  async joinQueue({ roomId, login, channel, senderName }) {
    try {
      const user = await this.twitchApi.getUserByLogin(login)
      await this.firebaseApi.joinQueue(roomId, user)
      this.client.say(channel, `${senderName} a rejoint la file d'attente`)
    } catch (err) {
      if (err === MAX_QUEUE_ERROR) {
        this.client.say(channel, "File d'attente pleine")
      } else if (err === ALREADY_IN_QUEUE) {
        this.client.say(channel, `${senderName} petit coquin, tu es déjà dans la file`)
      } else {
        console.log('err', err)
        this.client.say(channel, `Impossible de rejoindre la file d'attente`)
      }
    }
  }

  async onMessageHandler(channel, context, msg, self) {
    if (self) return
    if (!msg.startsWith('!')) return

    const { 'display-name': senderName, username: login, 'room-id': roomId } = context

    switch (msg) {
      case '!hello':
        this.client.say(channel, `Salutations ${senderName}`)
        break
      case '!song':
        await this.getSong({ channel })
        break
      case '!github':
        this.client.say(channel, `Retrouve moi sur https://github.com/AurelieV ${senderName}`)
        break
      case '!joinQueue':
      case '!jq':
        await this.joinQueue({ roomId, login, channel, senderName })
        break
      default:
        this.client.say(
          channel,
          `Tu racontes n'importe quoi ${senderName}. ${msg} n'est pas une commande que je connais. Parles en à ma maitresse pour avoir plus de feature`
        )
    }
  }
}

module.exports = {
  FoxBot,
}
