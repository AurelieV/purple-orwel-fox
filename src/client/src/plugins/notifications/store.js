const ADD_NOTIFICATION_MUTATION = 'Add notification'
export const REMOVE_NOTIFICATION_MUTATION = 'Remove notification'
export const PUSH_NOTIFICATION_ACTION = 'Push notification'

export default function store() {
  return {
    state() {
      return {
        items: [],
        id: 0,
      }
    },
    mutations: {
      [REMOVE_NOTIFICATION_MUTATION](state, id) {
        state.items = state.items.filter(n => n.id !== id)
      },
      [ADD_NOTIFICATION_MUTATION](state, notif) {
        state.items.push({ ...notif, id: state.id })
        state.id = state.id + 1
      },
    },
    actions: {
      [PUSH_NOTIFICATION_ACTION]({ commit, state }, { type = 'info', message }) {
        const notifId = state.id
        commit(ADD_NOTIFICATION_MUTATION, { type, message })
        setTimeout(() => {
          commit(REMOVE_NOTIFICATION_MUTATION, notifId)
        }, 5000)
      },
    },
  }
}
