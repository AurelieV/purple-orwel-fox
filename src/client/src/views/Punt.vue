<template>
  <div class="punt-page">
    <transition name="rotate">
      <div v-if="isDisplayed">
        <img src="/sunglass.png" />
        <p>OUPS</p>
      </div>
    </transition>
  </div>
</template>

<script>
import puntCounterMixin from '@/mixins/puntCounter'
export default {
  mixins: [puntCounterMixin],
  data() {
    return {
      isDisplayed: false,
      displayedTimeout: null,
    }
  },
  destroyed() {
    if (this.displayedTimeout) {
      clearTimeout(this.displayedTimeout)
    }
  },
  watch: {
    puntCounter(val, oldVal) {
      if (oldVal === undefined || val === 0 || this.isDisplayed) return
      if (this.displayedTimeout) {
        clearTimeout(this.displayedTimeout)
        this.displayedTimeout = null
      }
      this.isDisplayed = true
      this.displayedTimeout = setTimeout(() => (this.isDisplayed = false), 5000)
    },
  },
}
</script>

<style lang="scss">
.punt-page {
  width: 400px;
  height: 400px;
  font-size: 40px;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  img {
    width: 200px;
    margin-bottom: -30px;
  }
  .rotate-enter-active {
    animation: rotate-center 0.6s ease-in-out both;
  }
  .rotate-leave-active {
    animation: rotate-center 0.6s ease-in-out both;
  }
  @keyframes rotate-center {
    0% {
      transform: rotate(0);
    }
    100% {
      transform: rotate(360deg);
    }
  }
}
</style>
