import * as Oidc from 'oidc-client'
import * as jwtDecode from 'jwt-decode'

export default function authFactory({ firebaseAuth, store, client, authConfig }) {
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
      client_id: authConfig.twitchClientId,
      redirect_uri: authConfig.redirectUri,
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

  async function getToken() {
    if (!firebaseAuth.currentUser) return null
    return await firebaseAuth.currentUser.getIdToken()
  }

  async function getUserInfo() {
    const token = await getToken()
    if (!token) return {}
    const { display_name: name, profile_image_url: profileImage } = jwtDecode(token)
    return { name, profileImage }
  }

  return {
    isInitialized,
    loginWithTwitch,
    processTwitchToken,
    logout,
    getToken,
    getUserInfo,
  }
}
