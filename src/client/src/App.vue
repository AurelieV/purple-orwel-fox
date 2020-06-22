<template>
  <div id="app">
    <Notifications></Notifications>
    <router-view />
  </div>
</template>

<script>
import { UPDATE_USER_ACTION, RESET_USER_ACTION } from '@/store'

export default {
  computed: {
    userId() {
      return this.$store.state.auth.uid
    },
  },
  watch: {
    userId: {
      handler: async function(userId) {
        if (!userId) {
          this.$store.dispatch(RESET_USER_ACTION)
          return
        }
        try {
          const userInfo = await this.$foxApi.getUserInfo()
          this.$store.dispatch(UPDATE_USER_ACTION, userInfo)
        } catch {
          this.$notifier.error('Impossible de récupérer vos informations. Rechargez la page')
        }
      },
      immediate: true,
    },
  },
}
</script>
