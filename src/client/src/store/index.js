import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const UPDATE_USER_MUTATION = 'Update user mutation'
const RESET_USER_MUTATION = 'Reset user mutation'

export const UPDATE_USER_ACTION = 'Update user action'
export const RESET_USER_ACTION = 'Reset user action'

export default new Vuex.Store({
  state: {
    user: undefined,
  },
  mutations: {
    [RESET_USER_MUTATION](state) {
      state.user = {}
    },
    [UPDATE_USER_MUTATION](state, user) {
      Vue.set(state, 'user', user)
    },
  },
  actions: {
    [UPDATE_USER_ACTION]({ commit }, user) {
      commit(UPDATE_USER_MUTATION, user)
    },
    [RESET_USER_ACTION]({ commit }, user) {
      commit(RESET_USER_MUTATION, user)
    },
  },
  modules: {},
})
