<template>
  <div class="queue-page">
    <template v-if="userId">
      <div class="queue-page__position">
        <p>Position actuelle: {{ currentPosition }}</p>
        <button v-if="isUserInQueue" class="pof-btn -primary" @click="leave">
          Quitter la queue
        </button>
        <button v-else class="pof-btn -primary" @click="join">Rejoindre</button>
      </div>
      <div class="queue-page__messages">
        <p>Dernier code: {{ (messages && messages[0]) || 'Aucun code reçu' }}</p>
        <button class="pof-btn -primary" @click="refreshMessages">Rafraichir le code</button>
      </div>
      <Queue :is-admin="false" :queue="queue" :channel-id="channelId"></Queue>
    </template>
    <div v-else>
      <p>Vous devez être connecté</p>
      <router-link :to="login">ICI</router-link>
    </div>
  </div>
</template>

<script>
import Queue from '@/components/Queue'

export default {
  components: { Queue },
  data() {
    return {
      queue: [],
      isLoading: true,
      messages: [],
    }
  },
  computed: {
    channelId() {
      return this.$route.params.channelId
    },
    userId() {
      return this.$store.state.auth.uid
    },
    currentIndex() {
      return this.queue.findIndex(({ user }) => user.id === this.userId)
    },
    isUserInQueue() {
      return this.currentIndex >= 0
    },
    currentPosition() {
      return this.currentIndex === -1 ? 'Pas dans la queue' : this.currentIndex + 1
    },
  },
  methods: {
    async join() {
      try {
        await this.$foxApi.joinQueue(this.channelId)
      } catch {
        this.$notifier.error('Impossible de rejoindre la queue')
      }
    },
    async leave() {
      try {
        await this.$foxApi.leaveQueue(this.channelId)
      } catch {
        this.$notifier.error('Impossible de sortir de la queue')
      }
    },
    async refreshMessages() {
      this.messages = await this.$foxApi.getMyMessages(this.channelId)
    },
  },
  watch: {
    channelId: {
      immediate: true,
      handler: async function channelId() {
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
    },
  },
}
</script>

<style lang="scss">
.queue-page {
  &__position,
  &__messages {
    margin: $spacing-2 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
