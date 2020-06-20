<template>
  <ul class="queue">
    <li
      v-for="item in queue"
      :key="item.id"
      class="queue__item"
      :class="{ '-active': isAdmin && item.active }"
    >
      <User
        :is-admin="isAdmin"
        :user="item.user"
        @delete="deleteItem(item.id)"
        @toggleActive="toggleActive(item)"
      />
    </li>
  </ul>
</template>

<script>
import User from '@/components/User'

export default {
  components: {
    User,
  },
  props: {
    queue: { type: Array, required: true },
    channelId: { type: String, required: true },
    isAdmin: { type: Boolean, default: true },
  },
  methods: {
    async deleteItem(itemId) {
      if (!this.isAdmin) return
      try {
        await this.$foxApi.deleteFromQueue(this.channelId, itemId)
        this.errorMessage = null
      } catch (err) {
        this.errorMessage = err
      }
    },
    async toggleActive(item) {
      if (!this.isAdmin) return
      try {
        await this.$foxApi.changeQueueItemState(this.channelId, item.id, !item.active)
        this.errorMessage = null
      } catch (err) {
        this.errorMessage = err
      }
    },
  },
}
</script>

<style lang="scss">
.queue {
  display: flex;
  list-style: none;
  flex-direction: column;
  padding: 0;
  &__item {
    position: relative;
    padding: 0.5rem;
    display: flex;
    &.-active {
      background-color: rebeccapurple;
      color: white;
    }
  }
}
</style>
