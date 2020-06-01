import { PUSH_NOTIFICATION_ACTION, REMOVE_NOTIFICATION_MUTATION } from './store'

export default class Notifier {
  constructor({ store }) {
    this.store = store
  }
  error(message) {
    return this.store.dispatch(PUSH_NOTIFICATION_ACTION, { type: 'error', message })
  }
  info(message) {
    return this.store.dispatch(PUSH_NOTIFICATION_ACTION, { type: 'info', message })
  }
  success(message) {
    return this.store.dispatch(PUSH_NOTIFICATION_ACTION, { type: 'success', message })
  }
  dimiss(notificationId) {
    return this.store.commit(REMOVE_NOTIFICATION_MUTATION, notificationId)
  }
}
