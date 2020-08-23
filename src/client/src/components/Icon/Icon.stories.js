import Icon from './Icon'

export default {
  title: 'Components/Utils/Icon',
  component: Icon,
}

const req = require.context('assets/icons')

export const BasicExample = () => ({
  components: { Icon },
  data() {
    const icons = req.keys().map(filepath => {
      const [filename] = filepath.split('/').reverse()
      return filename.replace('.svg', '')
    })
    return { icons }
  },
  template: `
    <div style="color: white;">
      <h1>Normal</h1>
      <div style="display: flex; flex-wrap: wrap; align-items: flex-start;">
        <div v-for="icon in icons" style="display: flex; flex-direction: column; align-items: center; padding: 0.5rem;">
          <Icon :name="icon"/>
          <span style="margin-top: 0.25rem;">{{icon}}</span>
        </div>
      </div>
      <h1 style="margin-top: 2rem;">Outline</h1>
      <div style="display: flex; flex-wrap: wrap; align-items: flex-start;">
        <div v-for="icon in icons" style="display: flex; flex-direction: column; align-items: center; padding: 0.5rem;">
          <Icon :name="icon" outline/>
          <span style="margin-top: 0.25rem;">{{icon}}</span>
        </div>
      </div>
    </div>
  `,
})

export const SizeExample = () => ({
  components: { Icon },
  template: `
  <div style="display: flex; flex-wrap: wrap; color: white;">
      <Icon name="favorite" small />
      <Icon name="favorite"/>
      <Icon name="favorite" large />
  </div>
  `,
})
