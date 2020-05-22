const tmi = require('tmi.js')
const { MAX_QUEUE_ERROR, ALREADY_IN_QUEUE } = require('../services/firebase-api')
const commands = require('./commands')
const PUNT_TRIGGER_VALUE = 3

class FoxBot {
  constructor({ config, firebaseApi, twitchApi }) {
    this.config = config
    this.firebaseApi = firebaseApi
    this.twitchApi = twitchApi
    this.puntTimeout = null
    this.punts = []
  }

  async start() {
    const client = new tmi.client(this.config)

    client.on('message', (...data) => this.onMessageHandler(...data))
    client.on('connected', async () => {
      await client.say(this.config.channels[0], 'Le renard est dans la place!')
      console.log('Fox is in place')
    })
    client.connect()
    this.client = client
  }

  async getSong({ channel, roomId }) {
    try {
      const { track } = await this.firebaseApi.getChannelInfo(roomId)
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
      const position = await this.firebaseApi.joinQueue(roomId, user)
      this.client.say(channel, `${senderName} a rejoint la file d'attente en position ${position}`)
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

  async getPositionInQueue({ channel, login, senderName, roomId }) {
    try {
      const { id: userId } = await this.twitchApi.getUserByLogin(login)
      const queue = await this.firebaseApi.getQueue(roomId)
      const position = (queue || []).findIndex(({ user }) => user.id === userId)
      if (position === -1) {
        return this.client.say(
          channel,
          `Tu n'es pas dans la queue ${senderName}. Pour la rejoindre tu peux taper la commande !jq
          Actuellement ${queue.length} personnes`
        )
      }
      return this.client.say(
        channel,
        `${senderName} tu es en position ${position + 1} dans la queue`
      )
    } catch (err) {
      console.log('err', err)
      return this.client.say(channel, `Désolé ${senderName} j'ai buggé`)
    }
  }

  async getQueue({ channel, roomId }) {
    try {
      const queue = await this.firebaseApi.getQueue(roomId)
      if (!queue || queue.length === 0) {
        return this.client.say(
          channel,
          'Personne dans la queue pour le moment. Pour rejoindre taper !jq'
        )
      }
      const message = (queue || [])
        .map(({ user }, index) => `- ${index + 1} ${user.display_name}`)
        .join('\n')
      return this.client.say(channel, message)
    } catch (err) {
      console.log('err', err)
      return this.client.say(channel, `Désolé j'ai buggé`)
    }
  }

  async leaveQueue({ channel, roomId, login, senderName }) {
    try {
      const { id: userId } = await this.twitchApi.getUserByLogin(login)
      const queue = await this.firebaseApi.getQueue(roomId)
      const item = (queue || []).find(({ user }) => user.id === userId)
      if (!item) {
        return this.client.say(channel, `Tu n'es pas dans la queue ${senderName}.`)
      }
      await this.firebaseApi.deleteFromQueue(roomId, item.id)
      this.client.say(
        channel,
        `Tu n'es plus dans la queue ${senderName}. ${queue.length - 1} personnes dans la queue`
      )
    } catch {
      this.client.say.channel(`Désolé j'ai buggé`)
    }
  }

  async punt({ roomId, channel, login }) {
    if (this.punts.includes(login)) return
    if (this.puntTimeout) {
      clearTimeout(this.puntTimeout)
    }
    this.punts.push(login)
    this.puntTimeout = setTimeout(() => (this.punts = []), 1000 * 60)
    if (PUNT_TRIGGER_VALUE === this.punts.length) {
      const puntCounter = await this.firebaseApi.triggerPunt(roomId)
      return this.client.say(channel, `Punt! Déjà ${puntCounter} fois`)
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
        await this.getSong({ channel, roomId })
        break
      case '!github':
        this.client.say(channel, `Retrouve moi sur https://github.com/AurelieV ${senderName}`)
        break
      case '!joinQueue':
      case '!jq':
        await this.joinQueue({ roomId, login, channel, senderName })
        break
      case '!position':
        await this.getPositionInQueue({ channel, login, senderName, roomId })
        break
      case '!queue':
        await this.getQueue({ channel, roomId })
        break
      case '!leaveQueue':
      case '!lq':
        await this.leaveQueue({ channel, roomId, login, senderName })
        break
      case '!punt':
        await this.punt({ roomId, channel, login })
        break
      default:
        const message = commands[msg]
        if (message) {
          return this.client.say(channel, message)
        }
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
