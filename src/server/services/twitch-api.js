const axios = require('axios').default

class TwitchApi {
  constructor({ config }) {
    this.config = config
    this.isInit = this.fetchOauthToken()
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
    return this.callTwitchApi({
      method: 'get',
      url: 'https://api.twitch.tv/helix/users',
      params: { login },
    })
  }
  createPubSubToken(channelId) {
    const data = {
      exp: Math.floor(Date.now() / 1000) + 30, // 30s expiration
      channel_id: channelId,
      user_id: this.config.ownerId,
      role: 'external',
      pubsub_perms: { send: ['*'] },
    }

    return jsonwebtoken.sign(data, this.config.clientSecret, { algorithm: 'HS256' })
  }
  async broadCastMessage(message, channelId) {
    const token = this.createPubSubToken(channelId)
    try {
      const { data } = await axios({
        method: 'post',
        headers: {
          'Client-ID': this.config.clientId,
          Authorization: `Bearer ${token}`,
        },
        data: {
          message,
          targets: ['broadcast'],
        },
      })
      return data
    } catch (err) {
      console.log('Error', err)
      throw err
    }
  }
}

module.exports = {
  TwitchApi,
}
