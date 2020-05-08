<template>
  <div>
    <p v-if="isLoading">Chargement en cours...</p>
    <div v-else class="twitch-content" :class="`-${theme}`">
      <nuxt-child></nuxt-child>
    </div>
  </div>
</template>

<script>
export default {
  head() {
    return {
      script: [
        { src: 'https://extension-files.twitch.tv/helper/v1/twitch-ext.min.js', hid: 'twitch-ext' },
      ],
    }
  },
  data() {
    return {
      isLoading: true,
    }
  },
  async mounted() {
    await this.$auth.isInitialized
    this.isLoading = false
  },
  computed: {
    theme() {
      return this.$store.state.twitch.context.theme
    },
  },
}
</script>
