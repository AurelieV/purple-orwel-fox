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
import { IS_CONNECTED } from '@/plugins/vue/firebase/store'
import Dashboard from '@/components/Dashboard'

export default {
  components: {
    Dashboard,
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
  },
}
</script>

<style lang="scss"></style>
