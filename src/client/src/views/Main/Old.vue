<template>
  <div class="admin-page">
    <template v-if="!isConnected">
      <p>Vous devez vous connectez pour commencer l'administration de votre channel</p>
      <button @click="loginWithTwitch">Login with Twitch</button>
    </template>
    <Dashboard v-else :channel-id="channelId"></Dashboard>
  </div>
</template>

<script>
import { IS_CONNECTED } from '@/plugins/firebase/store'
import Dashboard from '@/components/Dashboard'

export default {
  components: {
    Dashboard,
  },
  data() {
    return {
      errorMessage: '',
    }
  },
  computed: {
    channelId() {
      return this.$store.state.auth.uid
    },
    isConnected() {
      return this.$store.getters[IS_CONNECTED]
    },
  },
  methods: {
    async loginWithTwitch() {
      this.$auth.loginWithTwitch()
    },
    async logout() {
      try {
        this.errorMessage = ''
        await this.$auth.logout()
      } catch {
        this.errorMessage = 'Impossible de se déconnecter'
      }
    },
  },
}
</script>

<style lang="scss">
.admin-page {
  padding: $spacing-4;
}
</style>
