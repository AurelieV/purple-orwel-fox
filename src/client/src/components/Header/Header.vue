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
    <portal-target class="pof-header__actions" name="header-actions"></portal-target>
  </header>
</template>

<script>
import Menu from '@/components/Menu/Menu'
import Icon from '@/components/Icon/Icon'

export default {
  components: { Menu, Icon },
  computed: {
    channelId() {
      return this.$store.state.auth.uid
    },
    userInfo() {
      return this.$store.state.auth.info
    },
    userMenuItems() {
      return [
        {
          label: 'Voir le dashboard',
          key: 'dashboard',
          disabled: this.$route?.name === 'main-home',
        },
        { label: 'Se Déconnecter', key: 'logout' },
      ]
    },
  },
  methods: {
    async logout() {
      try {
        await this.$auth.logout()
        this.$router.push({ name: 'login' })
      } catch {
        this.$notifier.error('Impossible de se déconnecter')
      }
    },
    onMenuItemClicked({ item }) {
      switch (item.key) {
        case 'logout':
          this.logout()
          break
        case 'dashboard':
          this.$router.push({ name: 'main-home' })
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
  &__actions {
    flex: 1 0 auto;
    // note pour Aurélie du futur: je te l'avais dis que ça te péterais à la gueule !
    display: flex;
    justify-content: flex-end;
  }
}
</style>
