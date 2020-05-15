export class FoxApi {
  constructor({ store, client }) {
    this.store = store
    this.client = client
  }
  async sayHello() {
    try {
      await this.client({
        method: 'post',
        url: '/twitch/hello',
        headers: {
          Authorization: `Bearer ${this.store.state.twitchAuth.token}`,
        },
      })
    } catch (err) {
      console.log(err)
    }
  }
  async getMessage(messageId) {
    try {
      const channelId = this.store.state.twitchAuth.channelId
      const { data } = await this.client({
        method: 'get',
        url: `twitch/${channelId}/message/${messageId}`,
        headers: {
          Authorization: `Bearer ${this.store.state.twitchAuth.token}`,
        },
      })
      return data.message
    } catch (err) {
      console.log(err)
    }
  }
  async deleteFromQueue(channelId, itemId) {
    try {
      await this.client({
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
      await this.client({
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
      await this.client({
        method: 'post',
        url: `/admin/queue/${channelId}/message`,
        data: { message },
      })
    } catch (err) {
      console.log(err)
      throw err
    }
  }
}
