import Vue from 'vue'

export const CONTEXT_SET_MUTATION = 'Twitch context set mutation'

export function createTwitchStoreModule() {
  return {
    state: () => {
      return {
        context: {
          theme: 'light',
        },
      }
    },
    mutations: {
      [CONTEXT_SET_MUTATION](state, context) {
        Vue.set(state, 'context', context)
      },
    },
  }
}
