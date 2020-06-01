<template>
  <div class="main" :class="{ '-connected': !isConnected }">
    <header class="main__header">
      <template v-if="isConnected">
        <div class="main__header-content">Connecté en tant que {{ channelId }}</div>
        <div class="main__header-actions">
          <button class="pof-btn" @click="logout">Se déconnecter</button>
        </div>
      </template>
    </header>
    <div class="main__content">
      <LoginInfo v-if="!isConnected"></LoginInfo>
    </div>
  </div>
</template>

<script>
import { IS_CONNECTED } from '@/plugins/firebase/store'
import LoginInfo from '@/components/LoginInfo'

export default {
  components: { LoginInfo },
  data() {
    return {
      errorMessage: '',
    }
  },
  computed: {
    channelId() {
      return this.$store.state.firebaseAuth.uid
    },
    isConnected() {
      return this.$store.getters[IS_CONNECTED]
    },
  },
  methods: {
    async logout() {
      try {
        this.errorMessage = ''
        await this.$dbAuth.logout()
      } catch {
        this.errorMessage = 'Impossible de se déconnecter'
      }
    },
  },
}
</script>

<style lang="scss">
.main {
  &__header {
    height: $header-height;
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    background-color: $primary-color;
    color: white;
    display: flex;
    align-items: center;
    .-connected & {
      height: 0;
    }
  }
  &__header-content {
    flex: 1;
  }
  &__header-action {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
  &__content {
    background-color: $neutral-background-color;
    min-height: 100vh;
    box-sizing: border-box;
    padding-top: $header-height;
    .-connected & {
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
