<template>
  <div class="queue-page">
    <p v-if="!channelId">Entrez un channelId en paramètre</p>
    <template v-else>
      <p v-if="isLoading">Chargement des données...</p>
      <ul v-else>
        <li v-for="(item, index) in queue" :key="item.id">{{ index + 1 }} - {{ item.login }}</li>
      </ul>
    </template>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isLoading: true,
      queue: [],
    }
  },
  computed: {
    channelId() {
      return this.$route.query.channelId
    },
  },
  async mounted() {
    if (!this.channelId) {
      this.isLoading = false
      return
    }
    await this.$bind(
      'queue',
      this.$db
        .collection('channels')
        .doc(this.channelId)
        .collection('queue')
        .orderBy('date', 'asc')
    )
    this.isLoading = false
  },
}
</script>

<style lang="scss">
.queue-page {
  width: 300px;
  height: 600px;
}
</style>
