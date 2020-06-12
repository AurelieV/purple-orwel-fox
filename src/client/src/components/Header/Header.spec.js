import { shallowMount } from '@vue/test-utils'
import { Store } from 'vuex-mock-store'

import Header from './Header'

function factory({
  channelId = '1234',
  userInfo = { name: 'User', profileImage: '/image' },
  logout = jest.fn(),
} = {}) {
  return shallowMount(Header, {
    mocks: {
      $store: new Store({
        state: {
          auth: {
            uid: channelId,
            info: userInfo,
          },
        },
      }),
      $auth: {
        logout,
      },
      $notifier: {
        error: jest.fn(),
      },
    },
  })
}

describe('Header', () => {
  test('should render component', () => {
    const wrapper = factory()
    expect(wrapper.vm).toBeTruthy()
  })
  test('should display user name', () => {
    const wrapper = factory({ userInfo: { name: 'MyUser' } })
    expect(wrapper.text().includes('MyUser')).toBeTruthy()
  })
  test('should display channelId', () => {
    const wrapper = factory({ channelId: '1234' })
    expect(wrapper.text().includes('1234')).toBeTruthy()
  })
  test('should display profile image', () => {
    const wrapper = factory({ userInfo: { profileImage: '/my-image/path' } })
    const images = wrapper
      .findAll('img')
      .filter(image => image.attributes('src') === '/my-image/path')
    expect(images.length).toBe(1)
  })
  test('should disconnect onMenuClicked', () => {
    const logout = jest.fn()
    const wrapper = factory({
      logout,
    })
    wrapper.vm.onMenuItemClicked({ item: { key: 'logout' } })
    expect(logout.mock.calls.length).toBe(1)
  })
  test('should notify an error if logout failed', async () => {
    const logout = () => Promise.reject()
    const wrapper = factory({ logout })
    await wrapper.vm.logout()
    expect(wrapper.vm.$notifier.error.mock.calls.length).toBe(1)
    expect(wrapper.vm.$notifier.error).toHaveBeenCalledWith('Impossible de se déconnecter')
  })
})
