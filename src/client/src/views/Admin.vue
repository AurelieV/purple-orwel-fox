<template>
  <div class="admin-page">
    <template v-if="!isConnected">
      <p>Vous devez vous connectez pour commencer l'administration de votre channel</p>
      <button @click="loginWithTwitch">Login with Twitch</button>
    </template>
    <template v-else>
      <p class="error" v-if="errorMessage">{{ errorMessage }}</p>
      <button @click="logout">Se déconnecter</button>
      <Dashboard :channel-id="channelId"></Dashboard>
    </template>
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
      return this.$store.state.firebaseAuth.uid
    },
    isConnected() {
      return this.$store.getters[IS_CONNECTED]
    },
  },
  methods: {
    async loginWithTwitch() {
      this.$dbAuth.loginWithTwitch()
    },
    async logout() {
      try {
        this.errorMessage = ''
        await this.$dbAuth.logout()
      } catch {
        this.errorMessage = 'Impossible de se déconnecter'
      }
    },
  },
}
</script>

<style lang="scss">
.error {
  color: red;
}
</style>
