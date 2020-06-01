<template>
  <div>
    <p v-if="!errorMessage">Authentification en cours...</p>
    <p v-else class="error">{{ errorMessage }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      errorMessage: null,
    }
  },
  async mounted() {
    const code = this.$route.query.code
    if (!code) {
      this.errorMessage = 'Pas de code !'
      return
    }
    try {
      const user = await this.$dbAuth.processTwitchToken(code)
      this.$router.push({ name: 'main' })
    } catch (err) {
      console.log('Authent error', err)
      this.errorMessage = "Impossible de procéder à l'authentification"
    }
  },
}
</script>

<style lang="scss" scoped>
.error {
  color: red;
}
</style>
