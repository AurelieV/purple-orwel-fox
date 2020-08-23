<template>
  <svg
    class="pof-icon"
    focusable="false"
    aria-hidden="true"
    :class="{ '-small': small, '-large': large, '-outline': outline }"
  >
    <use :xlink:href="iconPath"></use>
  </svg>
</template>

<script>
export default {
  props: {
    /** Name of the icons (see assets/icons filename) */
    name: { type: String, required: true },
    small: { type: Boolean, default: false },
    large: { type: Boolean, default: false },
    outline: { type: Boolean, default: false },
  },
  computed: {
    iconPath() {
      return `/icons.svg#sprite-${this.name}`
    },
  },
}
</script>

<style lang="scss">
.pof-icon {
  fill: currentColor;
  stroke: currentColor;
  transition: fill 0.2s linear;
  --pof-icon-size: var(--pof-icon-size-2);
  width: var(--pof-icon-size);
  height: var(--pof-icon-size);
  &.-small {
    --pof-icon-size: var(--pof-icon-size-1);
  }
  &.-large {
    --pof-icon-size: var(--pof-icon-size-3);
  }
  &.-outline {
    fill: transparent;
  }
}
</style>
