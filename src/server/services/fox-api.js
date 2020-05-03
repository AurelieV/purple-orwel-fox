const axios = require('axios').default
const https = require('https')

class FoxApi {
  constructor({ apiPath }) {
    // TODO: different config on prod
    this.caller = axios.create({
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
      }),
    })
    this.apiPath = apiPath
  }
  async getCurrentTrack() {
    const { data } = await this.caller.get(`${this.apiPath}/music/track`)
    return data.track
  }
}

module.exports = { FoxApi }
