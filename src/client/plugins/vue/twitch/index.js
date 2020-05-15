import { createAuthStoreModule, AUTH_SET_MUTATION } from './auth-store'
import { createTwitchStoreModule, CONTEXT_SET_MUTATION } from './store'
import authFactory from './auth'

export default {
  install(Vue, { store }) {
    store.registerModule('twitchAuth', createAuthStoreModule())
    store.registerModule('twitch', createTwitchStoreModule())
    Vue.prototype.$twitchAuth = authFactory(store)

    this.broadcastlisteners = []

    Vue.prototype.$broadcast = {
      listen: fn => {
        this.broadcastlisteners.push(fn)
        return () => {
          const index = this.broadcastlisteners.findIndex(fn)
          this.broadcastlisteners.splice(index, 1)
        }
      },
    }

    if (!process.client || !window.Twitch || !window.Twitch.ext) return
    window.Twitch.ext.onAuthorized(auth => {
      store.commit(AUTH_SET_MUTATION, auth)
    })
    window.Twitch.ext.onError(err => console.log('Twitch error', err))
    window.Twitch.ext.onContext(context => {
      store.commit(CONTEXT_SET_MUTATION, context)
    })
    window.Twitch.ext.listen('broadcast', (target, contentType, stringMessage) => {
      try {
        const message = JSON.parse(stringMessage)
        this.broadcastlisteners.forEach(fn => fn(message))
      } catch (err) {
        console.log('ERR', err)
      }
    })
  },
}
