export default function authFactory(store) {
  const isInitialized = new Promise(resolve => {
    if (store.state.twitchAuth.token !== undefined) {
      resolve()
      return
    }
    const unwatch = store.watch(
      state => state.twitchAuth.token,
      () => {
        resolve()
        unwatch()
      }
    )
  })

  return {
    isInitialized,
  }
}
