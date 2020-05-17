import jwt_decode from 'jwt-decode'

export const AUTH_SET_MUTATION = 'Auth set mutation'

export function createAuthStoreModule() {
  return {
    state: () => {
      return {
        token: undefined,
        channelId: undefined,
        clientId: undefined,
        userId: undefined,
      }
    },
    mutations: {
      [AUTH_SET_MUTATION](state, auth) {
        Object.assign(state || {}, auth, { decode: jwt_decode(auth.token) })
      },
    },
  }
}
