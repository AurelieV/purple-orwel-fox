<template>
  <div class="dashboard">
    <p v-if="isLoading">Chargement des données...</p>
    <template v-else>
      <h1>Admistration de {{ channelId }}</h1>
      <p v-if="errorMessage" class="dashboard__error">{{ errorMessage }}</p>
      <form @submit.prevent="sendMessageToActive" class="dashboard__send-message">
        <input maxlength="100" type="text" v-model="message" required />
        <button type="submit" :disabled="!message">Envoyer un message</button>
      </form>
      <ul class="dashboard__queue">
        <li
          v-for="(item, index) in queue"
          :key="item.id"
          class="dashboard__queue-item"
          :class="{ '-active': item.active }"
        >
          <div>{{ index + 1 }} - {{ item.user.login }}</div>
          <button @click="deleteItem(item.id)">Supprimer</button>
          <button @click="toggleActive(item)">
            {{ item.active ? 'Désactiver' : 'Activer' }}
          </button>
        </li>
      </ul>
      <ul>
        <li v-for="message in messages" :key="message.id">{{ message.value }}</li>
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
      errorMessage: null,
      message: '',
      messages: [],
    }
  },
  props: {
    channelId: { type: String, required: true },
  },
  methods: {
    async deleteItem(itemId) {
      try {
        await this.$foxApi.deleteFromQueue(this.channelId, itemId)
        this.errorMessage = null
      } catch (err) {
        this.errorMessage = err
      }
    },
    async toggleActive(item) {
      try {
        await this.$foxApi.changeQueueItemState(this.channelId, item.id, !item.active)
        this.errorMessage = null
      } catch (err) {
        this.errorMessage = err
      }
    },
    async sendMessageToActive() {
      try {
        await this.$foxApi.sendMessageToActive(this.channelId, this.message)
        this.errorMessage = null
        this.message = ''
      } catch (err) {
        this.errorMessage = err
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
            .limit(10)
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
    color: red;
    font-style: italic;
  }
  &__queue {
    display: flex;
    list-style: none;
    flex-direction: column;
    align-items: flex-start;
  }
  &__queue-item {
    padding: 0.5rem 1rem;
    display: flex;
    border: 1px solid black;
    &:not(:first-child) {
      margin-top: 1rem;
    }
    button {
      margin-left: 1rem;
    }
    &.-active {
      background-color: rebeccapurple;
      color: white;
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
}
</style>
