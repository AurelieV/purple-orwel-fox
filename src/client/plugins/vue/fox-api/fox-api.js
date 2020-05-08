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
          Authorization: `Bearer ${this.store.state.auth.token}`,
        },
      })
    } catch (err) {
      console.log(err)
    }
  }
  async deleteFromQueue(channelId, itemId) {
    try {
      await this.client({
        method: 'delete',
        url: `/queue/${channelId}/${itemId}`,
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
        url: `/queue/${channelId}/${itemId}/active`,
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
        url: `/queue/${channelId}/message`,
        data: { message },
      })
    } catch (err) {
      console.log(err)
      throw err
    }
  }
}
