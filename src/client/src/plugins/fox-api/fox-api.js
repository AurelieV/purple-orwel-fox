export class FoxApi {
  constructor({ store, client, firebaseAuth }) {
    this.store = store
    this.client = client
    this.firebaseAuth = firebaseAuth
  }
  async sendAdminRequest(params) {
    const token = await this.firebaseAuth.getToken()
    return this.client({
      ...params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  }
  async deleteFromQueue(channelId, itemId) {
    try {
      await this.sendAdminRequest({
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
      await this.sendAdminRequest({
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
      await this.sendAdminRequest({
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
      await this.sendAdminRequest({
        method: 'post',
        url: `/admin/${channelId}/punt/reset`,
      })
    } catch (err) {
      console.log(err)
      throw err
    }
  }
}
