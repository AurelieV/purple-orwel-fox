<template>
  <div class="channel-page">
    <template v-if="channel">
      <div class="channel-page__header">
        <h1 class="title-1">Page de {{ channel.display_name }}</h1>
        <p class="body">{{ channel.description }}</p>
      </div>
      <portal to="header-actions">
        <button
          title="Ajouter en favoris"
          class="pof-btn -with-icon -primary"
          @click="toggleFavorite"
          :disabled="isFavoritePending"
        >
          <Icon name="favorite" :outline="!isFavorite" />
        </button>
      </portal>
    </template>
    <p v-else>Chargement en cours ...</p>
  </div>
</template>

<script>
import Icon from '@/components/Icon/Icon'
import { IS_FAVORITE, UPDATE_USER_ACTION } from '@/store'

export default {
  components: { Icon },
  data() {
    return {
      channel: {},
      isFavoritePending: false,
    }
  },
  computed: {
    channelId() {
      return this.$route.params.channelId
    },
    isFavorite() {
      return this.$store.getters[IS_FAVORITE](this.channelId)
    },
  },
  methods: {
    async toggleFavorite() {
      this.isFavoritePending = true
      try {
        const method = this.isFavorite ? 'removeFromFavorites' : 'addToFavorites'
        const favorites = await this.$foxApi[method](this.channelId)
        this.$store.dispatch(UPDATE_USER_ACTION, { favorites })
      } catch (err) {
        this.$notifier.error('Impossible de modifier vos favoris')
      }
      this.isFavoritePending = false
    },
  },
  watch: {
    channelId: {
      immediate: true,
      async handler(channelId) {
        try {
          this.channel = await this.$foxApi.getChannelInfo(channelId)
        } catch {
          this.$notifier.error(`Ce channel n'existe pas`)
          this.$router.push({ name: 'main-home' })
        }
      },
    },
  },
}
</script>

<style lang="scss">
.channel-page {
  padding: $spacing-4 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  &__header {
    max-width: rem(800px);
    text-align: center;
    h1 {
      margin-bottom: $spacing-2;
    }
  }
}
</style>
