export default function authFactory(store) {
  const isInitialized = new Promise(resolve => {
    if (store.state.auth.token !== undefined) {
      resolve()
      return
    }
    const unwatch = store.watch(
      state => state.auth.token,
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
