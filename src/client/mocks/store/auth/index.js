const USERS = {}

// We dynamically required all the profile from users folder
const req = require.context('./users')
req.keys().forEach(filepath => {
  const username = filepath.replace('./', '')
  USERS[username] = req(filepath).default
})

export default function mockAuth({ user = 'connected' } = {}) {
  return {
    state() {
      return {
        auth: (USERS[user] || USERS.connected)(),
      }
    },
  }
}
