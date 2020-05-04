import { createAuthStoreModule, AUTH_SET_MUTATION } from './auth-store'
import { createContextStoreModule, CONTEXT_SET_MUTATION } from './context-store'
import authFactory from './auth'

export default {
  install(Vue, { store }) {
    store.registerModule('auth', createAuthStoreModule())
    store.registerModule('context', createContextStoreModule())
    Vue.prototype.$auth = authFactory(store)

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

    if (process.client) {
      window.Twitch.ext.onAuthorized(auth => {
        store.commit(AUTH_SET_MUTATION, auth)
      })
      window.Twitch.ext.onContext(context => {
        window.Twitch.ext.rig.log('Pouet', context)
        store.commit(CONTEXT_SET_MUTATION, context)
      })
    }
    if (process.client) {
      window.Twitch.ext.listen('broadcast', (target, contentType, stringMessage) => {
        try {
          const message = JSON.parse(stringMessage)
          this.broadcastlisteners.forEach(fn => fn(message))
        } catch (err) {
          console.log('ERR', err)
        }
      })
    }
  },
}
