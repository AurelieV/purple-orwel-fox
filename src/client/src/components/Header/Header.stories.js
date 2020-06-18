import Header from './Header'
import { withStore } from '@@/.storybook/decorators/with-store'

export default {
  title: 'Components/Layout/Header',
  component: Header,
  decorators: [withStore],
  parameters: {
    store: { user: 'connected' },
  },
}

export const BaseHeader = () => {
  return {
    components: { Header },
    name: 'BaseHeader',
    template: `
        <Header style="{position: fixed; top: 0; right: 0; left: 0; height: 64px;}" />
    `,
  }
}
