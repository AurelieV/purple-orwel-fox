<template>
  <div class="admin-page">
    <p v-if="!channelId">Entrez un channelId en paramètre</p>
    <template v-else>
      <p v-if="isLoading">Chargement des données...</p>
      <template v-else>
        <h1>Admistration de {{ channelId }}</h1>
        <p v-if="errorMessage" class="admin-page__error">{{ errorMessage }}</p>
        <form @submit.prevent="sendMessageToActive" class="admin-page__send-message">
          <input maxlength="100" type="text" v-model="message" required />
          <button type="submit" :disabled="!message">Envoyer aux gens activés</button>
        </form>
        <ul class="admin-page__queue">
          <li
            v-for="(item, index) in queue"
            :key="item.id"
            class="admin-page__queue-item"
            :class="{ '-active': item.active }"
          >
            <div>{{ index + 1 }} - {{ item.login }}</div>
            <button @click="deleteItem(item.id)">Supprimer</button>
            <button @click="toggleActive(item)">
              {{ item.active ? 'Désactiver' : 'Activer' }}
            </button>
          </li>
        </ul>
      </template>
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
}
</script>

<style lang="scss">
.admin-page {
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
