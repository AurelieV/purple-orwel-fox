<template>
  <div class="main-home-page">
    <section class="main-home-page__section">
      <h2 class="title-1">Favoris</h2>
      <ul class="main-home-page__favorites">
        <li class="main-home-page__favorite" v-for="favorite in favoriteInfo" :key="favorite.id">
          <router-link
            class="main-home-page__favorite-link"
            :to="{ name: 'channel', params: { channelId: favorite.id } }"
          >
            <img class="main-home-page__favorite-img" :src="favorite.profile_image_url" />
            <span class="body main-home-page__favorite-name">{{ favorite.display_name }}</span>
          </router-link>
        </li>
      </ul>
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return {
      favoriteInfo: [],
      isFetchingFavorite: false,
    }
  },
  computed: {
    favorites() {
      return this.$store.state.user?.favorites || []
    },
  },
  watch: {
    favorites: {
      immediate: true,
      async handler(favorites) {
        if (favorites.length === 0) {
          this.favoriteInfo = []
          return
        }
        this.isFetchingFavorite = true
        try {
          this.favoriteInfo = await this.$foxApi.getChannelsInfo(favorites)
        } catch {
          this.$notifier.error('Impossible de récupérer vos favoris')
        }
        this.isFetchingFavorite = true
      },
    },
  },
}
</script>

<style lang="scss">
.main-home-page {
  &__favorites {
    margin-top: $spacing-1;
    display: flex;
    flex-wrap: wrap;
  }
  &__favorite {
    --card-per-row: 2;
    --gap-between-card: #{$spacing-2};
    width: calc(100% / var(--card-per-row) - var(--gap-between-card));
    min-width: rem(100px);
    margin: calc(var(--gap-between-card) / 2);
    @include responsive('tablet') {
      --card-per-row: 4;
    }
    @include responsive('desktop') {
      --card-per-row: 6;
    }
  }
  &__favorite-link {
    display: flex;
    width: 100%;
    height: 100%;
    flex-direction: column;
    align-items: center;
    box-sizing: border-box;
    @include card();
  }
  &__favorite-img {
    width: 100%;
  }
  &__favorite-name {
    max-width: 100%;
    text-overflow: ellipsis;
    overflow: hidden;
  }
}
</style>
