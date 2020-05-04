export const CONTEXT_SET_MUTATION = 'Twitch context set mutation'

export function createContextStoreModule() {
  return {
    state: () => {
      return {
        theme: 'light',
      }
    },
    mutations: {
      [CONTEXT_SET_MUTATION](state, context) {
        Object.assign(state || {}, context)
      },
    },
  }
}
