<template>
  <div class="panel-page">
    <p>{{ currentMessage || 'Pas de code' }}</p>
  </div>
</template>

<script>
import { CONTEXT_SET_MUTATION } from '@/plugins/vue/twitch/store'
export default {
  data() {
    return {
      unsubscribe: null,
      currentMessage: '',
    }
  },
  computed: {
    auth() {
      return this.$store.state.twitchAuth
    },
  },
  mounted() {
    this.unsubscribe = this.$broadcast.listen(this.handleMessage)
  },
  destroyed() {
    if (this.unsubscribe) this.unsubscribe()
  },
  methods: {
    async handleMessage({ type, payload }) {
      switch (type) {
        case 'NEW_MESSAGE':
          if (!this.auth || !this.auth.decode.user_id) return
          const { userIds, messageId } = payload
          const isAuthorized = (userIds || []).some(id => id === this.auth.decode.user_id)
          if (!isAuthorized) return
          const message = await this.$foxApi.getMessage(messageId)
          this.currentMessage = message
          break
      }
    },
  },
}
</script>

<style lang="scss">
.panel-page {
  font-size: rem(20px);
  .-light & {
    background-color: $twitch-light-bg-color;
    color: $twitch-light-text-color;
  }
  .-dark & {
    background-color: $twitch-dark-bg-color;
    color: $twitch-dark-text-color;
  }
}
</style>
