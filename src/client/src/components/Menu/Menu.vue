<template>
  <!-- We stop event propagation for handle menu close. Maybe (surely) dirty -->
  <div class="pof-menu" @click.stop="" :class="`-${align}`">
    <button
      class="pof-menu__button"
      :class="buttonClass"
      aria-haspopup="true"
      :aria-controls="id"
      :aria-expanded="isOpened ? 'true' : 'false'"
      :disabled="disabled"
      @click="toggle"
    >
      <slot></slot>
    </button>
    <transition name="fade">
      <ul v-show="isOpened" class="pof-menu__list" role="menu" :aria-labelledby="id">
        <li
          class="pof-menu__item"
          v-for="(item, index) in items"
          :key="index"
          @click="$emit('itemClicked', { item, index })"
          :class="{ '-disabled': item.disabled }"
        >
          <slot name="menu-item" v-bind="{ index, item }"></slot>
        </li>
      </ul>
    </transition>
  </div>
</template>

<script>
/** Generic component to display a button + list menu */
export default {
  props: {
    /** UniqueId use to generate accesibility attributes */
    id: { type: String, required: true },
    /** List to iterate for the menu list */
    items: { type: Array, required: true },
    /** Disabled the button for displaying the menu */
    disabled: { type: Boolean, required: false, default: false },
    buttonClass: { type: String, required: false, default: '' },
    align: { type: String, required: false, default: 'center' },
  },
  mounted() {
    window.document.addEventListener('click', this.onClick)
  },
  data() {
    return { isOpened: false }
  },
  destroyed() {
    window.document.removeEventListener('click', this.onClick)
  },
  methods: {
    toggle() {
      this.isOpened = !this.isOpened
    },
    onClick(el) {
      if (this.isOpened) {
        this.isOpened = false
      }
    },
  },
}
</script>

<style lang="scss">
.pof-menu {
  position: relative;
  z-index: zindex('modal');
  &__list {
    position: absolute;
    top: calc(100% + #{$spacing-2});
    width: auto;
    min-width: 100%;
    background: white;
    color: $neutral-700;
    border-radius: 10px;
    box-shadow: $shadow-2;
    z-index: zindex('modal');

    // Arrow up
    &:after {
      $arrowSize: $spacing-2;
      z-index: zindex('modal');
      content: '';
      position: absolute;
      top: -$arrowSize;
      left: calc(50% - #{$arrowSize});
      width: 0;
      height: 0;
      border-left: $arrowSize solid transparent;
      border-right: $arrowSize solid transparent;
      border-bottom: $arrowSize solid white;
    }

    &.-center &__list {
      left: 50%;
      transform: translateX(-50%);
    }
    &.-left &__list {
      left: 0;
    }

    &.fade-enter-active,
    &.fade-leave-active {
      transition: opacity 0.5s;
    }
    &.fade-enter,
    &.fade-leave-to {
      opacity: 0;
    }
  }
  &__item {
    user-select: none;
    cursor: pointer;
    padding: $spacing-5 $spacing-4;
    transition: background 0.2s linear;
    &:hover:not(.-disabled) {
      transition: background 0.5s linear;
      background: $purple-200 radial-gradient(circle, transparent 1%, $purple-200 1%) center/15000%;
    }
    &:active:not(.-disabled) {
      background-color: $purple-400;
      background-size: 100%;
      transition: background 0s;
    }
    &.-disabled {
      color: $neutral-400;
      cursor: not-allowed;
    }
  }
}
</style>
