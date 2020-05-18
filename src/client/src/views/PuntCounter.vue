<template>
  <div class="punt-counter-page">{{ puntCounter }} punts!</div>
</template>

<script>
import puntCounterMixin from '@/mixins/puntCounter'
export default {
  mixins: [puntCounterMixin],
}
</script>

<style lang="scss">
.punt-counter-page {
  width: 200px;
  height: 50px;
}
</style>
