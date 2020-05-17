<template>
  <div class="dashboard">
    <p v-if="isLoading">Chargement des données...</p>
    <template v-else>
      <h1>Admistration de {{ channelId }}</h1>
      <p v-if="errorMessage" class="dashboard__error">{{ errorMessage }}</p>
      <div class="dashboard__configuration">
        <label for="nbPlayersPerGame">Nombre de joueurs</label>
        <input id="nbPlayersPerGame" type="number" v-model="nbPlayersPerGame" />
      </div>
      <form @submit.prevent="sendMessageToActive" class="dashboard__send-message">
        <input maxlength="100" type="text" v-model="message" required />
        <button type="submit" class="btn -primary -outlined" :disabled="!message">
          Envoyer un message
        </button>
      </form>
      <div class="dashboard__actions">
        <button @click="selectNext" class="btn -outlined -primary">Select next</button>
        <button @click="deleteActive" class="btn -outlined -primary">Supprimer actifs</button>
      </div>
      <div class="dashboard__queues">
        <Queue :queue="nextInQueue" :channel-id="channelId"></Queue>
        <Queue :queue="lastInQueue" :channel-id="channelId"></Queue>
      </div>
      <ul>
        <li v-for="message in messages" :key="message.id">{{ message.value }}</li>
      </ul>
    </template>
  </div>
</template>

<script>
import Queue from '@/components/Queue'

export default {
  components: { Queue },
  data() {
    return {
      isLoading: true,
      queue: [],
      errorMessage: null,
      message: '',
      messages: [],
      nbPlayersPerGame: 3,
    }
  },
  props: {
    channelId: { type: String, required: true },
  },
  computed: {
    nextInQueue() {
      return this.queue.slice(0, this.nbPlayersPerGame)
    },
    lastInQueue() {
      return this.queue.slice(this.nbPlayersPerGame)
    },
  },
  methods: {
    async sendMessageToActive() {
      try {
        await this.$foxApi.sendMessageToActive(this.channelId, this.message)
        this.errorMessage = null
        this.message = ''
      } catch (err) {
        this.errorMessage = err
      }
    },
    async selectNext() {
      try {
        this.errorMessage = ''
        await Promise.all(
          this.nextInQueue
            .filter(({ active }) => !active)
            .map(item => this.$foxApi.changeQueueItemState(this.channelId, item.id, true))
        )
      } catch {
        this.errorMessage = "Impossible d'activer"
      }
    },
    async deleteActive() {
      try {
        this.errorMessage = ''
        await Promise.all(
          this.queue
            .filter(({ active }) => active)
            .map(item => this.$foxApi.deleteFromQueue(this.channelId, item.id))
        )
      } catch {
        this.errorMessage = 'Impossible de supprimer'
      }
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
        await this.$bind(
          'messages',
          this.$db
            .collection('channels')
            .doc(this.channelId)
            .collection('messages')
            .orderBy('date', 'desc')
            .limit(3)
        )
        this.isLoading = false
      },
    },
  },
}
</script>

<style lang="scss">
.dashboard {
  &__error {
    color: $error-color;
    font-style: italic;
  }
  &__actions {
    display: flex;
    margin: $s-space 0;
    :not(:first-child) {
      margin-left: $xs-space;
    }
  }
  &__send-message {
    display: flex;
    input {
      width: 200px;
    }
    button {
      margin-left: 1rem;
    }
  }
  &__configuration {
    margin-bottom: $m-space;
    display: flex;
    input {
      width: 50px;
      margin-left: $s-space;
    }
  }
  &__queues {
    display: flex;
    .queue {
      flex: 1;
      &:not(:first-child) {
        margin-left: $m-space;
      }
    }
  }
}
</style>
