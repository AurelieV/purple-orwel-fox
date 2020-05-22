const axios = require('axios').default
const jsonwebtoken = require('jsonwebtoken')
class TwitchApi {
  constructor({ config, firebaseApi }) {
    this.config = config
    this.isInit = this.fetchOauthToken()
    this.firebaseApi = firebaseApi
    this.usersByLogin = {}
  }
  async fetchOauthToken() {
    try {
      const { data } = await axios({
        method: 'post',
        url: 'https://id.twitch.tv/oauth2/token',
        headers: { 'Client-ID': this.config.clientId },
        params: {
          client_id: this.config.clientId,
          client_secret: this.config.apiSecret,
          grant_type: 'client_credentials',
        },
      })
      this.accessToken = data.access_token
    } catch (err) {
      console.log('err', err)
      throw err
    }
  }
  async callTwitchApi(axiosParams, retry = 1) {
    await this.isInit
    try {
      const { data } = await axios({
        ...axiosParams,
        headers: { Authorization: `Bearer ${this.accessToken}`, 'Client-ID': this.config.clientId },
      })
      return data
    } catch (err) {
      if (retry > 0 && err.response && err.response.status === '401') {
        await this.fetchOauthToken()
        return this.callTwitchApi(axiosParams, retry - 1)
      } else {
        throw err
      }
    }
  }
  async getUserByLogin(login) {
    if (this.usersByLogin[login]) return this.usersByLogin[login]
    const user = await this.fetchUserByLogin(login)
    this.usersByLogin[login] = user
    return user
  }
  async fetchUserByLogin(login) {
    const { data } = await this.callTwitchApi({
      method: 'get',
      url: 'https://api.twitch.tv/helix/users',
      params: { login },
    })
    return data[0]
  }
  async getUserById(id) {
    const { data } = await this.callTwitchApi({
      method: 'get',
      url: 'https://api.twitch.tv/helix/users',
      params: { id },
    })
    return data[0]
  }
  createPubSubToken(channelId) {
    const data = {
      exp: Math.floor(Date.now() / 1000) + 30, // 30s expiration
      channel_id: channelId,
      user_id: this.config.ownerId,
      role: 'external',
      pubsub_perms: { send: ['*'] },
    }

    return jsonwebtoken.sign(data, Buffer.from(this.config.clientSecret, 'base64'), {
      algorithm: 'HS256',
    })
  }
  async broadCastMessage(message, channelId) {
    const token = this.createPubSubToken(channelId)
    try {
      const { data } = await axios({
        method: 'post',
        url: `https://api.twitch.tv/extensions/message/${channelId}`,
        headers: {
          'Client-ID': this.config.clientId,
          Authorization: `Bearer ${token}`,
        },
        data: {
          message: JSON.stringify(message),
          content_type: 'application/json',
          targets: ['broadcast'],
        },
      })
      return data
    } catch (err) {
      console.log('Error', err)
      throw err
    }
  }

  async processOidcCode(code) {
    const { data } = await axios({
      method: 'post',
      url: 'https://id.twitch.tv/oauth2/token',
      headers: { 'Client-ID': this.config.clientId },
      params: {
        client_id: this.config.clientId,
        client_secret: this.config.apiSecret,
        grant_type: 'authorization_code',
        code,
        redirect_uri: 'https://stream.purple-fox.fr/admin/redirect',
      },
    })

    const { sub: userId } = jsonwebtoken.decode(data.id_token)
    const user = await this.getUserById(userId)

    return user
  }
}

module.exports = {
  TwitchApi,
}
