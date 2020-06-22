export class FoxApi {
  constructor({ store, client, auth }) {
    this.store = store
    this.client = client
    this.auth = auth
  }
  async sendAuthenticatedRequest(params) {
    const token = await this.auth.getToken()
    return this.client({
      ...params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  }
  async deleteFromQueue(channelId, itemId) {
    try {
      await this.sendAuthenticatedRequest({
        method: 'delete',
        url: `/admin/queue/${channelId}/${itemId}`,
      })
    } catch (err) {
      console.log(err)
      throw err
    }
  }
  async changeQueueItemState(channelId, itemId, value) {
    try {
      await this.sendAuthenticatedRequest({
        method: 'patch',
        url: `/admin/queue/${channelId}/${itemId}/active`,
        data: { value },
      })
    } catch (err) {
      console.log(err)
      throw err
    }
  }
  async sendMessageToActive(channelId, message) {
    try {
      await this.sendAuthenticatedRequest({
        method: 'post',
        url: `/admin/queue/${channelId}/message`,
        data: { message },
      })
    } catch (err) {
      console.log(err)
      throw err
    }
  }
  async resetPunt(channelId) {
    try {
      await this.sendAuthenticatedRequest({
        method: 'post',
        url: `/admin/${channelId}/punt/reset`,
      })
    } catch (err) {
      console.log(err)
      throw err
    }
  }

  async getMyMessages(channelId) {
    try {
      const { data } = await this.sendAuthenticatedRequest({
        method: 'get',
        url: `/admin/queue/${channelId}/my-messages`,
      })
      return data.messages
    } catch (err) {
      console.log(err)
      throw err
    }
  }

  async joinQueue(channelId) {
    try {
      const { data } = await this.sendAuthenticatedRequest({
        method: 'post',
        url: `/admin/queue/${channelId}/join`,
      })
      return data
    } catch (err) {
      console.log(err)
      throw err
    }
  }

  async leaveQueue(channelId) {
    try {
      const { data } = await this.sendAuthenticatedRequest({
        method: 'post',
        url: `/admin/queue/${channelId}/leave`,
      })
      return data
    } catch (err) {
      console.log(err)
      throw err
    }
  }

  async addToFavorites(channelId) {
    try {
      const { data } = await this.sendAuthenticatedRequest({
        method: 'post',
        url: `/admin/favorite`,
        data: {
          channelId,
        },
      })
      return data.favorites
    } catch (err) {
      console.log(err)
      throw err
    }
  }

  async removeFromFavorites(channelId) {
    try {
      const { data } = await this.sendAuthenticatedRequest({
        method: 'delete',
        url: `/admin/favorite`,
        data: {
          channelId,
        },
      })
      return data.favorites
    } catch (err) {
      console.log(err)
      throw err
    }
  }

  async getUserInfo() {
    try {
      const { data } = await this.sendAuthenticatedRequest({
        method: 'get',
        url: `/admin/me`,
      })
      return data
    } catch (err) {
      console.log(err)
      throw err
    }
  }
}
