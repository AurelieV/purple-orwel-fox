import { makeDecorator } from '@storybook/addons'
import Vuex from 'vuex'
import mockAuth from '@@/mocks/store/auth'

export const withStore = makeDecorator({
  name: 'withStore',
  parameterName: 'store',
  skipIfNoParametersOrOptions: false,
  wrapper(getStory, context, { parameters }) {
    const store = new Vuex.Store(mockAuth({ user: parameters?.user }))
    return {
      name: 'StoreWrapper',
      store,
      template: `<story />`,
    }
  },
})
