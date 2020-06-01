<template>
  <div class="notifications">
    <div :class="`-${notification.type}`" class="notification" v-if="notification">
      <div class="notification__message">{{ notification.message }}</div>
      <button @click="close(notification.id)">X</button>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    notification() {
      return this.$store.state.notifications.items[0]
    },
  },
  methods: {
    close(notificationId) {
      this.$notifier.dimiss(notificationId)
    },
  },
}
</script>

<style lang="scss">
.notifications {
  position: fixed;
  right: 0;
  left: 0;
  top: $spacing-4;
  z-index: 100;
  display: flex;
  justify-content: center;
  .notification {
    min-height: 50px;
    width: 80vw;
    border-radius: 20px;
    box-shadow: 5px 5px 20px #cbcdd3;
    display: flex;
    align-items: center;
    @include responsive('desktop') {
      width: 300px;
    }
    padding: $spacing-4;
    &.-success {
      background: linear-gradient(to bottom right, #b0db7d 40%, #99dbb4 100%);
      color: white;
    }
    &.-error {
      background: linear-gradient(to bottom left, #ef8d9c 40%, #ffc39e 100%);
      color: white;
    }
    &.-info {
      background: linear-gradient(to bottom left, $secondary-color 40%, $primary-color 100%);
      color: white;
    }
    &__message {
      flex: 1 0 auto;
    }
  }
}
</style>
