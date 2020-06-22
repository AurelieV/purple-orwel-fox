<template>
  <div class="main">
    <Header />
    <div class="main__content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import Header from '@/components/Header/Header'

export default {
  components: { Header },
}
</script>

<style lang="scss">
.main {
  .pof-header {
    height: $header-height;
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
  }
  &__content {
    background-color: $neutral-background-color;
    min-height: 100vh;
    box-sizing: border-box;
    padding: $header-height $spacing-4;
  }
}
</style>
