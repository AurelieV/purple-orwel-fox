<template>
  <div class="punt-counter-page">{{ puntCounter }} punts!</div>
</template>

<script>
import channelInfoMixin from '@/mixins/channelInfo'
export default {
  mixins: [channelInfoMixin],
}
</script>

<style lang="scss">
.punt-counter-page {
  width: 200px;
  height: 50px;
}
</style>
