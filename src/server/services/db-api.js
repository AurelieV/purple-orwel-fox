const MongoClient = require('mongodb').MongoClient

class DbApi {
  constructor({ config }) {
    const client = new MongoClient(config.uri, { useNewUrlParser: true })
    this.db = client.connect().then(() => client.db('purpleorwelfox'))
  }

  async addUserFavorite(userId, channelId) {
    const db = await this.db
    const { value } = await db
      .collection('users')
      .findOneAndUpdate(
        { userId },
        { $addToSet: { favorites: channelId } },
        { upsert: true, returnOriginal: false }
      )

    return value.favorites
  }
  async removeUserFavorite(userId, channelId) {
    const db = await this.db
    const { value } = await db
      .collection('users')
      .findOneAndUpdate(
        { userId },
        { $pull: { favorites: channelId } },
        { upsert: true, returnOriginal: false }
      )

    return value.favorites
  }
  async getUserById(userId) {
    const db = await this.db
    return db.collection('users').findOne({ userId }, { favorites: 1 })
  }
}

module.exports = { DbApi }
