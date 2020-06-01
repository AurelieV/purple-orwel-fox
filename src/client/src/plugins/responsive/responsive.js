import Vue from 'vue'

import shared from '@/styles/shared-variables.json'
const breakpoints = Object.keys(shared.minBreakpoints).sort(
  (a, b) => shared.minBreakpoints[a] - shared.minBreakpoints[b]
)

export default new Vue({
  data() {
    return {
      currentBreakpoint: breakpoints[0],
    }
  },
  computed: {
    isMobile() {
      return this.currentBreakpoint === 'mobile'
    },
    isTablet() {
      return this.currentBreakpoint === 'tablet'
    },
    isDesktop() {
      return this.currentBreakpoint === 'desktop'
    },
    isTabletOrHigher() {
      return this.isTablet || this.isDesktop
    },
  },
})
