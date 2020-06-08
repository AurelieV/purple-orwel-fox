<template>
  <div class="login-info">
    <h1 class="title-1">Bienvenue sur PurpleFox Stream Suite</h1>
    <p class="body login-info__description">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis hendrerit massa id purus tempus,
      ut consectetur nibh condimentum. Class aptent taciti sociosqu ad litora torquent per conubia
      nostra, per inceptos himenaeos
    </p>
    <img class="login-info__illustration" src="/login_illustration.svg" />
    <button class="login-info__action pof-btn -primary" @click="loginWithTwitch">Commencer</button>
  </div>
</template>

<script>
export default {
  methods: {
    async loginWithTwitch() {
      this.$auth.loginWithTwitch()
    },
  },
}
</script>

<style lang="scss">
.login-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  @include card();
  &__description {
    margin-top: $spacing-4;
  }
  &__illustration {
    width: 100%;
    margin-top: $spacing-6;
  }
  &__action {
    margin-top: $spacing-4;
  }
}
</style>
