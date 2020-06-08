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
      <div class="small_imgs">
        <div class="sun">
          <span class="sun-circle"></span>
          <span class="sunbeam-1"></span>
          <span class="sunbeam-2"></span>
          <span class="sunbeam-3"></span>
          <span class="sunbeam-4"></span>
          <span class="sunbeam-5"></span>
          <span class="sunbeam-6"></span>
        </div>
        <span class="orwel-square"></span>
        <span class="orwel-circle"></span>
      </div>
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
      const user = await this.$dbAuth.processTwitchToken(code)
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

.small_imgs {
  position: absolute;
  top: 150px;
  left: 461px;
}
.orwel-square,
.orwel-circle {
  display: block;
  position: relative;
  &:before,
  &:after {
    content: '';
    position: absolute;
    display: block;
  }
}

.orwel-circle {
  top: 50px;
  top: 104px;
  left: 700px;
  animation: bounce 2s ease infinite;
  &:before,
  &:after {
    border-radius: 50%;
  }
  &:before {
    background-color: #814bb8;
    top: 0;
    left: 0;
    width: 29px;
    height: 29px;
  }
  &:after {
    border: 2px solid #2f2e41;
    top: 0px;
    left: 0px;
    width: 26px;
    height: 26px;
    animation: 3s linear 1s infinite alternate slidein;
  }
}
.orwel-square {
  top: 35px;
  left: 471px;
  top: 294px;
  left: 419px;
  &:before {
    background-color: #ffa317;
    top: 0;
    left: 0;
    width: 32px;
    height: 31px;
    animation: bounce 2s ease infinite;
  }
  &:after {
    border: 2px solid #2f2e41;
    top: -6px;
    left: 6px;
    width: 30px;
    height: 29px;
    animation: 3s linear 1s infinite alternate slidein;
  }
}
@keyframes slidein {
  from {
    transform: translate(-20%, 10%);
  }
  50% {
    transform: translate(0%, 0%);
  }
  to {
    transform: translate(20%, -10%);
  }
}
@keyframes bounce {
  from {
    top: 0px;
  }
  50% {
    top: -5px;
  }
  to {
    top: 0px;
  }
}

#loader {
  display: none;
}

.sun {
  display: block;
  position: relative;
  top: 182px;
  left: 197px;
  height: 0px;
  width: 0px;
  animation: loader-animation 3s infinite ease-in-out;
  transform-origin: 0 0;
  & .sun-circle {
    display: block;
    position: relative;
    top: 0;
    left: 0;
    height: 90px;
    width: 90px;
    background-color: #ffa317;
    border: 4px solid #2f2e41;
    border-radius: 50%;
    transform: translate(-50%, -50%);
    z-index: 100;
  }
  & .sunbeam-1,
  & .sunbeam-2,
  & .sunbeam-3,
  & .sunbeam-4,
  & .sunbeam-5,
  & .sunbeam-6 {
    display: block;
    position: absolute;
    top: 129px;
    left: -24px;
    transform-origin: 50% -100%;
    &:before {
      content: '';
      z-index: 10;
      display: block;
      position: relative;
      height: 36px;
      width: 36px;
      background-color: #814bb8;
      border: 6px solid #2f2e41;
      border-radius: 50%;
    }
    &:after {
      content: '';
      z-index: 1;
      display: block;
      position: relative;
      top: -106px;
      left: 18px;
      height: 0;
      width: 1px;
      border-top: 0 solid transparent;
      border-left: 7px solid transparent;
      border-right: 7px solid transparent;
      border-bottom: 76px solid #2f2e41;
    }
  }
  & .sunbeam-2 {
    transform: rotate(180deg);
  }
  & .sunbeam-3 {
    transform: rotate(60deg);
  }
  & .sunbeam-4 {
    transform: rotate(-60deg);
  }
  & .sunbeam-5 {
    transform: rotate(120deg);
  }
  & .sunbeam-6 {
    transform: rotate(-120deg);
  }
}
</style>
