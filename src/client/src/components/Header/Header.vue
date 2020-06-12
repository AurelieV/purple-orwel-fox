<template>
  <header class="pof-header">
    <Menu id="header-user-info" :items="userMenuItems" @itemClicked="onMenuItemClicked">
      <div class="pof-header__user">
        <div class="pof-header__user-img">
          <img :src="userInfo.profileImage" />
        </div>
        <div class="pof-header__user-name">{{ userInfo.name }}</div>
        <div class="pof-header__channel-id">{{ channelId }}</div>
      </div>
      <template v-slot:menu-item="{ item }">{{ item.label }}</template>
    </Menu>
  </header>
</template>

<script>
import Menu from '@/components/Menu/Menu'

export default {
  components: { Menu },
  data() {
    return {
      userMenuItems: [{ label: 'Se Déconnecter', key: 'logout' }],
    }
  },
  computed: {
    channelId() {
      return this.$store.state.auth.uid
    },
    userInfo() {
      return this.$store.state.auth.info
    },
  },
  methods: {
    async logout() {
      try {
        await this.$auth.logout()
      } catch {
        this.$notifier.error('Impossible de se déconnecter')
      }
    },
    onMenuItemClicked({ item }) {
      if (item.key === 'logout') {
        this.logout()
      }
    },
  },
}
</script>

<style lang="scss">
.pof-header {
  background-color: $primary-color;
  color: white;
  display: flex;
  align-items: center;
  padding: 0 $spacing-4;
  z-index: zindex('header');
  &__user {
    flex: 1;
    display: flex;
    align-items: center;
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
  &__channel-id {
    font-size: $font-size-1;
    color: hsl(hue($primary-color), 20%, lightness($neutral-300));
    font-weight: 300;
    margin-left: $spacing-2;
  }
}
</style>
