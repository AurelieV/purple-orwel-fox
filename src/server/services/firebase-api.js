const firebaseAdmin = require('firebase-admin')

const Timestamp = firebaseAdmin.firestore.Timestamp
const FieldValue = firebaseAdmin.firestore.FieldValue

const MAX_QUEUE = 20
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
  constructor({ db, firebaseAuth }) {
    this.db = db
    this.firebaseAuth = firebaseAuth
  }
  async getQueue(channelId) {
    const queueSnapshot = await this.db
      .collection('channels')
      .doc(channelId)
      .collection('queue')
      .orderBy('date', 'asc')
      .get()
    const queue = []
    queueSnapshot.forEach((snapshot) => queue.push({ id: snapshot.id, ...snapshot.data() }))

    return queue
  }
  async joinQueue(channelId, user) {
    return await withRetry(async () => {
      const currentQueue = await this.getQueue(channelId)
      if (currentQueue.length >= MAX_QUEUE) {
        throw MAX_QUEUE_ERROR
      }
      if (currentQueue.find((item) => item.user.id === user.id)) {
        throw ALREADY_IN_QUEUE
      }
      await this.db.collection('channels').doc(channelId).collection('queue').add({
        user,
        date: Timestamp.now(),
      })

      return currentQueue.length + 1
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

  async addMessage(channelId, message) {
    const activeItems = await this.getActiveQueueItems(channelId)
    const userIds = activeItems.map(({ user }) => user.id)
    const { id: messageId } = await this.db
      .collection('channels')
      .doc(channelId)
      .collection('messages')
      .add({
        value: message,
        userIds,
        date: Timestamp.now(),
      })

    return { messageId, userIds }
  }

  async getMessages(channelId) {
    const messagesSnapshot = await this.db
      .collection('channels')
      .doc(channelId)
      .collection('messages')
      .orderBy('date', 'desc')
      .get()

    const messages = []
    messagesSnapshot.forEach((snapshot) => messages.push({ id: snapshot.id, ...snapshot.data() }))

    return messages
  }

  async getMessage(channelId, messageId) {
    const snapshot = await this.db
      .collection('channels')
      .doc(channelId)
      .collection('messages')
      .doc(messageId)
      .get()

    return snapshot.data()
  }

  async getChannelInfo(channelId) {
    const snapshot = await this.db.collection('channels').doc(channelId).get()

    return snapshot.data()
  }

  async triggerPunt(channelId) {
    await this.db
      .collection('channels')
      .doc(channelId)
      .update({
        puntCounter: FieldValue.increment(1),
      })

    const channel = await this.getChannelInfo(channelId)

    return channel.puntCounter
  }

  async triggerGG(channelId) {
    await this.db
      .collection('channels')
      .doc(channelId)
      .update({
        ggCounter: FieldValue.increment(1),
      })

    const channel = await this.getChannelInfo(channelId)

    return channel.ggCounter
  }

  async resetPunt(channelId) {
    await this.db.collection('channels').doc(channelId).update({
      puntCounter: 0,
    })
  }

  async setTrack(channelId, track) {
    await this.db.collection('channels').doc(channelId).update({ track })
  }

  async createToken(user) {
    try {
      await this.firebaseAuth.getUser(user.id)
    } catch (e) {
      await this.firebaseAuth.createUser({ uid: user.id })
    }
    await this.firebaseAuth.setCustomUserClaims(user.id, user)
    const token = await this.firebaseAuth.createCustomToken(user.id)

    return token
  }

  async verifyIdToken(token) {
    return this.firebaseAuth.verifyIdToken(token)
  }
}

module.exports = { FirebaseApi, MAX_QUEUE_ERROR, ALREADY_IN_QUEUE, MAX_QUEUE }
