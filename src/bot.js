const tmi = require('tmi.js')

const config = require('../config/config')

module.exports = {
  start,
}

async function start({ getCurrentSong }) {
  const client = new tmi.client(config)

  client.on('message', onMessageHandler)
  client.on('connected', async () => {
    await client.say(config.channels[0], 'Le renard est dans la place!')
    console.log('Fox is in place')
  })

  // Connect to Twitch:
  client.connect()

  function onMessageHandler(channel, context, msg, self) {
    if (self) return
    if (!msg.startsWith('!')) return

    const { 'display-name': senderName } = context

    switch (msg) {
      case '!hello':
        client.say(channel, `Salutations ${senderName}`)
        break
      case '!song':
        const song = getCurrentSong()
        if (song) {
          client.say(channel, `Actuellement à l'écoute: ${song}`)
        } else {
          client.say(channel, "Je ne sais pas :'(")
        }
        break
      default:
        client.say(
          channel,
          `Tu racontes n'importe quoi ${senderName}. ${msg} n'est pas une commande que je connais. Parles en à ma maitresse pour avoir plus de feature`
        )
    }
  }
}
