<template>
  <div class="current-track-page">{{ currentTrack }}</div>
</template>

<script>
import channelInfoMixin from '@/mixins/channelInfo'
export default {
  mixins: [channelInfoMixin],
}
</script>

<style lang="scss">
.current-track-page {
  width: 300px;
  height: 80px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0.25rem;
}
</style>
