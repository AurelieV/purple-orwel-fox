<template>
  <div class="main" :class="{ '-connected': !isConnected }">
    <header class="main__header">
      <template v-if="isConnected">
        <div class="main__header-content">
          <div class="main__user-img">
            <img :src="userInfo.profileImage" />
          </div>
          <div class="main__user-name">{{ userInfo.name }}</div>
        </div>
        <div class="main__header-actions">
          <button class="pof-btn" @click="logout">Se déconnecter</button>
        </div>
      </template>
    </header>
    <div class="main__content">
      <div v-if="isLoading"></div>
      <template v-else>
        <LoginInfo v-if="!isConnected"></LoginInfo>
      </template>
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
      isLoading: true,
    }
  },
  computed: {
    channelId() {
      return this.$store.state.firebaseAuth.uid
    },
    isConnected() {
      return this.$store.getters[IS_CONNECTED]
    },
    userInfo() {
      return this.$store.state.firebaseAuth.info
    },
  },
  async created() {
    await this.$dbAuth.isInitialized
    this.isLoading = false
  },
  methods: {
    async logout() {
      try {
        await this.$dbAuth.logout()
      } catch {
        this.$notifier.error('Impossible de se déconnecter')
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
    display: flex;
    align-items: center;
    padding: 0px $spacing-4;
  }
  &__user-img {
    margin-right: $spacing-2;
    overflow: hidden;
    position: relative;
    border-radius: 50%;
    width: $spacing-7;
    height: $spacing-7;

    &:after {
      content: '';
      border-radius: 50%;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      position: absolute;
      box-shadow: $inner-shadow;
    }
    img {
      width: $spacing-7;
      height: $spacing-7;
    }
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
