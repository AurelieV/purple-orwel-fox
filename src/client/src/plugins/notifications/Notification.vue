<template>
  <div :class="`-${notification.type}`" class="pof-notification" v-if="notification">
    <div class="body pof-notification__message">{{ notification.message }}</div>
    <button class="pof-notification__close-btn" @click="$emit('close', notification)">
      X
    </button>
  </div>
</template>

<script>
export default {
  props: {
    notification: { type: Object, required: true },
  },
}
</script>

<style lang="scss">
.pof-notification {
  min-height: rem(50px);
  width: 80vw;
  box-shadow: $shadow-4;
  position: relative;
  @include responsive('desktop') {
    width: rem(300px);
  }
  padding: $spacing-5 #{$spacing-4 + $spacing-3} $spacing-5 $spacing-4;
  border-radius: 10px;
  border-left-width: $spacing-2;
  border-left-style: solid;
  background-color: white;
  &.-success {
    border-color: green;
  }
  &.-error {
    border-color: red;
  }
  &.-info {
    border-color: $primary-color;
  }
  &__message {
    flex: 1 0 auto;
  }
  &__close-btn {
    position: absolute;
    top: $spacing-3;
    right: $spacing-3;
  }
}
</style>
