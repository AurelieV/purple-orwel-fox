<template>
  <div class="redirect-page">
    <div class="redirect-page__loader">
      <h1 class="body">Authentification en cours...</h1>
      <img
        class="redirect-page__loader-illustration"
        src="@/../public/authent_illustration.svg"
        svg-inline
        alt=""
      />
    </div>
  </div>
</template>

<script>
export default {
  async mounted() {
    const code = this.$route.query.code
    const loader = this.$el
      .getElementsByClassName('redirect-page__loader-illustration')[0]
      .getElementById('loader')
    const { x, y, width, height } = loader.getBBox()
    loader.style = `transform-origin: ${x + width / 2}px ${y + height / 2}px;`

    if (!code) {
      return
    }
    try {
      await this.$dbAuth.processTwitchToken(code)
    } catch (err) {
      this.$notifier.error('Impossible de se connecter. Réessayez plus tard.')
    }
    this.$router.push({ name: 'main' })
  },
}
</script>

<style lang="scss" scoped>
.redirect-page {
  background-color: $neutral-background-color;
  min-height: 100vh;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-right: $spacing-4;
  padding-left: $spacing-4;
  @include responsive('tablet') {
    align-items: center;
  }
  &__loader {
    @include card();
    @include responsive('tablet') {
      width: 80%;
    }
    @include responsive('desktop') {
      width: 60%;
      max-width: rem(800px);
    }
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    h1 {
      margin-bottom: $spacing-6;
      font-weight: bold;
      color: $neutral-800;
      font-size: $font-size-3;
      @include responsive('tablet') {
        font-size: $font-size-5;
      }
    }
  }
  &__loader-illustration {
    g#loader {
      transform: rotate(0deg);
      animation: loader-animation 3s infinite ease-in-out;
    }
  }
}
.error {
  color: red;
}

@keyframes loader-animation {
  0% {
    transform: rotate(0deg) scale(1);
  }
  50% {
    transform: rotate(180deg) scale(0.8);
  }
  100% {
    transform: rotate(360deg) scale(1);
  }
}
</style>
