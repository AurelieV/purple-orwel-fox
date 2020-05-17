export const IS_CONNECTED = 'isConnected'
export const UPDATE_USER_ACTION = 'updateUser'

const UPDATE_FIREBASE_USER_MUTATION = 'updateFirebaseUser'
const RESET_USER_MUTATION = 'resetUser'

export function createStoreModule() {
  return {
    state: {
      uid: undefined,
      isAnonymous: true,
    },
    mutations: {
      [UPDATE_FIREBASE_USER_MUTATION](state, { uid, isAnonymous }) {
        state.uid = uid
        state.isAnonymous = isAnonymous
      },
      [RESET_USER_MUTATION](state) {
        state.uid = null
      },
    },
    actions: {
      async [UPDATE_USER_ACTION]({ commit }, user) {
        if (user) {
          commit(UPDATE_FIREBASE_USER_MUTATION, user)
        } else {
          commit(RESET_USER_MUTATION)
        }
      },
    },
    getters: {
      [IS_CONNECTED](state) {
        return Boolean(state.uid) && !state.isAnonymous
      },
    },
  }
}
