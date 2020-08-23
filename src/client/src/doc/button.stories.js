import Icon from '@/components/Icon/Icon'

export default {
  title: 'Design System/Buttons',
}

export const BaseButton = () => ({
  template: `
        <div style="display: flex;">
            <button class="pof-btn">Normal</button>
            <button class="pof-btn -primary">Primary</button>
        </div>
        
    `,
})

export const IconButton = () => ({
  components: { Icon },
  template: `
    <div style="display: flex; align-items: center;">
        <button style="margin: 1rem;" class="pof-btn -with-icon -primary"><Icon name="favorite" small></Icon></button>
        <button style="margin: 1rem;" class="pof-btn -with-icon -primary"><Icon name="favorite"></Icon></button>
        <button style="margin: 1rem;" class="pof-btn -with-icon -primary"><Icon name="favorite" large></Icon></button>
    </div>
  `,
})
