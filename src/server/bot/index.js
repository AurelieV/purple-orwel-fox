const tmi = require('tmi.js')

module.exports = {
  start,
}

async function start({ config, foxApi }) {
  const client = new tmi.client(config)

  client.on('message', onMessageHandler)
  client.on('connected', async () => {
    await client.say(config.channels[0], 'Le renard est dans la place!')
    console.log('Fox is in place')
  })

  // Connect to Twitch:
  client.connect()

  async function onMessageHandler(channel, context, msg, self) {
    if (self) return
    if (!msg.startsWith('!')) return

    const { 'display-name': senderName } = context

    switch (msg) {
      case '!hello':
        client.say(channel, `Salutations ${senderName}`)
        break
      case '!song':
        try {
          const track = await foxApi.getCurrentTrack()
          if (track) {
            client.say(channel, `Actuellement à l'écoute: ${track}`)
          } else {
            client.say(channel, "Je ne sais pas :'(")
          }
        } catch (err) {
          console.log(err)
          client.say(channel, "Oups, j'ai planté")
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
