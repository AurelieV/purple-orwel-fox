<template>
  <div class="current-queue-page">
    <ul>
      <li v-for="item in queue" :key="item.id" class="item">
        <img class="item__img" :src="item.user.profile_image_url" />
        <div class="item__login">{{ item.user.display_name }}</div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queue: [],
    }
  },
  computed: {
    channelId() {
      return this.$route.params.channelId
    },
  },
  watch: {
    channelId: {
      immediate: true,
      handler(channelId) {
        this.$bind(
          'queue',
          this.$db
            .collection('channels')
            .doc(channelId)
            .collection('queue')
            .orderBy('date', 'asc')
        )
      },
    },
  },
}
</script>

<style lang="scss">
.current-queue-page {
  width: 500px;
  height: 800px;
  ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
  }
  .item {
    padding: 10px;
    display: flex;
    align-items: center;
    &__img {
      width: $small-image-size;
      margin-right: $s-space;
    }
  }
}
</style>
