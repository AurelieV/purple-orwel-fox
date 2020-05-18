export default {
  data() {
    return {
      channel: {},
    }
  },
  computed: {
    channelId() {
      return this.$route.params.channelId
    },
    puntCounter() {
      return this.channel && this.channel.puntCounter
    },
  },
  watch: {
    channelId: {
      immediate: true,
      handler(channelId) {
        this.$bind('channel', this.$db.collection('channels').doc(this.channelId))
      },
    },
  },
}
