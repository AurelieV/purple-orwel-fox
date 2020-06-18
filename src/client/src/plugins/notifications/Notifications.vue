<template>
  <div class="pof-notifications">
    <Notification
      v-if="notification"
      :notification="notification"
      @close="close(notification.id)"
    />
  </div>
</template>

<script>
import Notification from './Notification'

export default {
  components: { Notification },
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
.pof-notifications {
  position: fixed;
  right: 0;
  left: 0;
  top: $spacing-4;
  z-index: zindex('modal');
  display: flex;
  justify-content: center;
}
</style>
