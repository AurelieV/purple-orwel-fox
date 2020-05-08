const firebaseAdmin = require('firebase-admin')

const Timestamp = firebaseAdmin.firestore.Timestamp

const MAX_QUEUE = 100
const MAX_QUEUE_ERROR = 'Max queue error'
const ALREADY_IN_QUEUE = 'Already in queue'

async function withRetry(fn, nbRetry = 1) {
  try {
    return await fn()
  } catch (err) {
    if (nbRetry === 0) throw err
  }
  return await withRetry(fn, nbRetry - 1)
}

class FirebaseApi {
  constructor({ db }) {
    this.db = db
  }
  async getQueue(channelId) {
    const queueSnapshot = await this.db
      .collection('channels')
      .doc(channelId)
      .collection('queue')
      .get()
    const queue = []
    queueSnapshot.forEach((snapshot) => queue.push({ id: snapshot.id, ...snapshot.data() }))

    return queue
  }
  async joinQueue(channelId, login) {
    return await withRetry(async () => {
      const currentQueue = await this.getQueue(channelId)
      if (currentQueue.length >= MAX_QUEUE) {
        throw MAX_QUEUE_ERROR
      }
      if (currentQueue.find((item) => item.login === login)) {
        throw ALREADY_IN_QUEUE
      }
      await this.db.collection('channels').doc(channelId).collection('queue').add({
        login,
        date: Timestamp.now(),
      })
    })
  }
  async deleteFromQueue(channelId, itemId) {
    await this.db.collection('channels').doc(channelId).collection('queue').doc(itemId).delete()
  }
  async changeQueueItemState(channelId, itemId, value) {
    await this.db
      .collection('channels')
      .doc(channelId)
      .collection('queue')
      .doc(itemId)
      .update({ active: value })
  }
  async getActiveQueueItems(channelId) {
    const queueSnapshot = await this.db
      .collection('channels')
      .doc(channelId)
      .collection('queue')
      .where('active', '==', true)
      .get()
    const queue = []
    queueSnapshot.forEach((snapshot) => queue.push({ id: snapshot.id, ...snapshot.data() }))

    return queue
  }
}

module.exports = { FirebaseApi, MAX_QUEUE_ERROR, ALREADY_IN_QUEUE, MAX_QUEUE }
