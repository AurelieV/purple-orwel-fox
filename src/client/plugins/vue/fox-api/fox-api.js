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
}
