<template>
  <div class="panel-page" :class="`-${theme}`">
    <p>Hello world pouet pouet</p>
    <button @click="sayHello">Say hello</button>
    <p>{{ helloUsers.length }} personnes disent bonjour</p>
  </div>
</template>

<script>
import { CONTEXT_SET_MUTATION } from '@/plugins/vue/twitch/context-store'
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
      helloUsers: [],
      unsubscribe: null,
    }
  },
  computed: {
    auth() {
      return this.$store.state.auth
    },
    theme() {
      return this.$store.state.context.theme
    },
  },
  mounted() {
    this.unsubscribe = this.$broadcast.listen(this.handleMessage)
  },
  destroyed() {
    if (this.unsubscribe) this.unsubscribe()
  },
  methods: {
    sayHello() {
      this.$foxApi.sayHello()
    },
    handleMessage({ type, origin }) {
      if (type !== 'hello') return
      this.helloUsers = [...new Set([...this.helloUsers, origin])]
    },
  },
}
</script>

<style lang="scss">
.panel-page {
  &.-light {
    background-color: #fff;
    color: #232127;
  }
  &.-dark {
    background-color: #201c2b;
    color: #e5e3e8;
  }
}
</style>
