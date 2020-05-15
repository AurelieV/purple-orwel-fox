import * as Oidc from 'oidc-client'

export default function authFactory({ firebaseAuth, store, client }) {
  const isInitialized = new Promise(resolve => {
    if (store.state.firebaseAuth.uid !== undefined) {
      resolve(true)
      return
    }
    const unwatch = store.watch(
      state => state.firebaseAuth.uid,
      () => {
        resolve(true)
        unwatch()
      }
    )
  })

  // Redirect to Twitch auth page
  // TODO: load config
  async function loginWithTwitch() {
    const client = new Oidc.UserManager({
      authority: 'https://id.twitch.tv/oauth2/.well-known/openid-configuration',
      client_id: 'b8bh0bh0s60fc5ivzm2nyvkk6tqray',
      redirect_uri: 'https://localhost:8080/admin/redirect',
      response_type: 'code',
      scope: 'openid',
    })
    client.signinRedirect()
  }

  // Process twitch token after redirection to create a custom firebase token
  async function processTwitchToken(code) {
    const { data } = await client({
      method: 'post',
      url: '/admin/login',
      data: { code },
    })
    const { token, user } = data
    await firebaseAuth.signInWithCustomToken(token)

    return user
  }

  async function logout() {
    return await firebaseAuth.signOut()
  }

  return {
    isInitialized,
    loginWithTwitch,
    processTwitchToken,
    logout,
  }
}
