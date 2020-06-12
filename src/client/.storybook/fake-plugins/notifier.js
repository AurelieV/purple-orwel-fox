export default function install(Vue) {
  Vue.prototype.$notifier = {
    error: err => console.log('ERROR', err),
    info: err => console.log('INFO', err),
    success: err => console.log('SUCCESS', err),
  }
}
