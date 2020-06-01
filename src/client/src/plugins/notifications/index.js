import Notifications from './Notifications'
import notifStore from './store'
import Notifier from './notifier'

export default function install(Vue, { store }) {
  Vue.component('Notifications', Notifications)
  store.registerModule('notifications', notifStore())
  Vue.prototype.$notifier = new Notifier({ store })
}
