<template>
  <div class="main" :class="isConnected ? '-connected' : '-not-connected'">
    <Header v-if="isConnected" />
    <div class="main__content" v-if="!isLoading">
      <LoginInfo v-if="!isConnected"></LoginInfo>
      <router-view v-else></router-view>
    </div>
  </div>
</template>

<script>
import { IS_CONNECTED } from '@/plugins/firebase/store'
import LoginInfo from '@/components/LoginInfo'
import Header from '@/components/Header/Header'

export default {
  components: { LoginInfo, Header },
  data() {
    return {
      isLoading: true,
    }
  },
  computed: {
    isConnected() {
      return this.$store.getters[IS_CONNECTED]
    },
  },
  async created() {
    await this.$auth.isInitialized
    this.isLoading = false
  },
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
    padding-top: $header-height;
    .-connected & {
      display: block;
    }
    .-not-connected & {
      padding-top: 0;
    }
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding-right: $spacing-4;
    padding-left: $spacing-4;
    .login-info {
      @include responsive('tablet') {
        width: 80%;
      }
      @include responsive('desktop') {
        width: 40%;
        max-width: rem(800px);
      }
    }
  }
}
</style>
