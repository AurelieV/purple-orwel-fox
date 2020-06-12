import Header from './Header'

export default {
  title: 'Components/Layout/Header',
  component: Header,
}

export const BaseHeader = () => ({
  components: { Header },
  template: `
        <Header style="{position: fixed; top: 0; right: 0; left: 0; height: 64px;}" />
    `,
})
