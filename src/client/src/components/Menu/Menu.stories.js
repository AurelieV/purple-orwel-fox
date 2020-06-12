import Menu from './Menu'

export default {
  title: 'Components/Utils/Menu',
  component: Menu,
}

const Base = {
  components: { Menu },
  template: `
    <div :style="containerStyle">
      <Menu :items="items" button-class="pof-btn -primary" :align="align">
        Click me
        <template v-slot:menu-item="{ item }">{{ item.label }}</template>
      </Menu>
    </div>
  `,
  data() {
    return {
      align: 'center',
      containerStyle: {
        display: 'flex',
        justifyContent: 'center',
      },
    }
  },
}

export const BaseExample = () => ({
  mixins: [Base],
  data() {
    return {
      items: [{ label: 'Test' }, { label: 'Test2' }],
    }
  },
})

export const LongText = () => ({
  mixins: [Base],
  data() {
    return {
      items: [{ label: 'Un très long label très très long' }, { label: 'Test2' }],
    }
  },
})

export const AlignLeft = () => ({
  mixins: [Base],
  data() {
    return {
      items: [{ label: 'Test' }, { label: 'Test2' }],
      align: 'left',
      containerStyle: {
        display: 'inline-block',
      },
    }
  },
})
