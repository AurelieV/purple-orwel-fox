import { shallowMount } from '@vue/test-utils'
import Menu from './Menu'

function factory({
  id = 'id',
  items = [],
  buttonSlot = 'buttonSlot',
  itemSlot = 'itemSlot',
  disabled = undefined,
} = {}) {
  return shallowMount(Menu, {
    propsData: {
      id,
      items,
      disabled,
    },
    slots: {
      default: buttonSlot,
    },
  })
}

describe('Menu', () => {
  test('should mount', () => {
    const wrapper = factory()
    expect(wrapper.vm).toBeTruthy()
  })
  test('should render a button with buttonSlot', () => {
    const wrapper = factory({ buttonSlot: 'buttonContent' })
    const button = wrapper.find('button')
    expect(button.exists()).toBeTruthy()
    expect(button.text()).toBe('buttonContent')
  })
  test('should render accessibility attributes', () => {
    const wrapper = factory({ id: 'my-menu' })
    const button = wrapper.find('button')
    const menu = wrapper.find('ul')
    expect(button.attributes('aria-haspopup')).toBe('true')
    expect(button.attributes('aria-controls')).toBe('my-menu')
    expect(menu.attributes('role')).toBe('menu')
    expect(menu.attributes('aria-labelledby')).toBe('my-menu')
  })
  test('should not displayed menu at first render', () => {
    const wrapper = factory()
    const menu = wrapper.find('ul')
    const button = wrapper.find('button')
    expect(menu.element).not.toBeVisible()
    expect(button.attributes('aria-expanded')).toBe('false')
  })
  test('should display menu when clicking on button', async () => {
    const wrapper = factory()
    const menu = wrapper.find('ul')
    const button = wrapper.find('button')
    await button.trigger('click')
    expect(menu.element).toBeVisible()
    expect(button.attributes('aria-expanded')).toBe('true')
  })
  test('should emit event on item clicked', async () => {
    const items = [{ label: 'Item1' }, { label: 'Item2' }]
    const wrapper = factory({ items })

    const itemElements = wrapper.findAll('li')
    await itemElements.at(1).trigger('click')
    expect(wrapper.emitted().itemClicked.length).toBe(1)
    expect(wrapper.emitted().itemClicked[0]).toEqual([{ item: items[1], index: 1 }])
  })
  test('should disabled button if props disabled is passed', () => {
    const wrapper = factory({ disabled: true })
    const button = wrapper.find('button')
    expect(button.attributes('disabled')).toBe('disabled')
  })
})
