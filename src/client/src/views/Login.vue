<template>
  <div class="login-page">
    <div class="login-page__card">
      <h1 class="title-1">Bienvenue sur PurpleFox Stream Suite</h1>
      <p class="body login-page__description">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis hendrerit massa id purus
        tempus, ut consectetur nibh condimentum. Class aptent taciti sociosqu ad litora torquent per
        conubia nostra, per inceptos himenaeos
      </p>
      <img class="login-page__illustration" src="/login_illustration.svg" />
      <button class="login-page__action pof-btn -primary" @click="loginWithTwitch">
        Commencer
      </button>
    </div>
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
.login-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: $neutral-background-color;
  min-height: 100vh;
  box-sizing: border-box;
  padding: 0 $spacing-4;
  &__card {
    @include responsive('tablet') {
      width: 80%;
    }
    @include responsive('desktop') {
      width: 40%;
      max-width: rem(800px);
    }
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    @include card();
  }
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
