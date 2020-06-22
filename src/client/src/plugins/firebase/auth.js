import * as Oidc from 'oidc-client'
import * as jwtDecode from 'jwt-decode'

export default class Authentification {
  constructor({ firebaseAuth, store, client, authConfig }) {
    this.firebaseAuth = firebaseAuth
    this.store = store
    this.client = client
    this.authConfig = authConfig
    this.isInitialized = new Promise(resolve => {
      if (store.state.auth.uid !== undefined) {
        resolve(true)
        return
      }
      const unwatch = store.watch(
        state => state.auth.uid,
        () => {
          resolve(true)
          unwatch()
        }
      )
    })
  }

  // Redirect to Twitch auth page
  // TODO: load config
  async loginWithTwitch() {
    const oidcClient = new Oidc.UserManager({
      authority: 'https://id.twitch.tv/oauth2/.well-known/openid-configuration',
      client_id: this.authConfig.twitchClientId,
      redirect_uri: this.authConfig.redirectUri,
      response_type: 'code',
      scope: 'openid',
    })
    oidcClient.signinRedirect()
  }

  // Process twitch token after redirection to create a custom firebase token
  async processTwitchToken(code) {
    const { data } = await this.client({
      method: 'post',
      url: '/admin/login',
      data: { code },
    })
    const { token, user } = data

    // Return a promise which resolved only when store is updated
    // This allows to await this methods and execute logic only when store has correct info
    return new Promise((resolve, reject) => {
      // We listen to store change, and unsubscribe as soon as possible
      const unwatch = this.store.watch(
        state => state.auth.uid,
        uid => {
          if (!uid) return
          resolve(user)
          unwatch()
        }
      )
      this.firebaseAuth.signInWithCustomToken(token).catch(reject)
    })
  }

  async logout() {
    return await this.firebaseAuth.signOut()
  }

  async getToken() {
    if (!this.firebaseAuth.currentUser) return null
    return await this.firebaseAuth.currentUser.getIdToken()
  }

  async getUserInfo() {
    const token = await this.getToken()
    if (!token) return {}
    const { display_name: name, profile_image_url: profileImage } = jwtDecode(token)
    return { name, profileImage }
  }
}
