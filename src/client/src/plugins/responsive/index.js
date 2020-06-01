import responsive from './responsive'
import { addListener } from './media-queries'

export default function install(Vue) {
  Vue.prototype.$responsive = responsive
  addListener(breakpoint => (responsive.currentBreakpoint = breakpoint))
}
