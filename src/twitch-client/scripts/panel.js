window.PURPLE_FOX = window.PURPLE_FOX || {}

function onContext(context) {
  const el = document.getElementById('panel')
  el.className = `-${context.theme} panel`
}
function onAuthorized(auth) {
  window.PURPLE_FOX.auth = { ...auth, decode: jwtDecode(auth.token) }
}
function handleMessage({ type, payload }) {
  switch (type) {
    case 'NEW_MESSAGE':
      const auth = PURPLE_FOX.auth
      if (!auth || !auth.decode.user_id) return
      const { userIds, messageId } = payload
      const isAuthorized = (userIds || []).some((id) => id === auth.decode.user_id)
      if (!isAuthorized) return
      getMessage(auth.channelId, messageId).then((code) => {
        changeCode(code)
      })
      break
  }
}
function getMessage(channelId, messageId) {
  return fetch(`https://twitch-api.purple-fox.fr/twitch/${channelId}/message/${messageId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${window.PURPLE_FOX.auth.token}`,
    },
  })
    .then((res) => res.json())
    .then((data) => data.message)
    .catch((err) => console.log(err))
}

function changeCode(code) {
  const el = document.getElementById('code')
  el.innerHTML = code
}

window.Twitch.ext.onAuthorized(onAuthorized)
window.Twitch.ext.onContext(onContext)
window.Twitch.ext.listen('broadcast', (target, contentType, stringMessage) => {
  try {
    const message = JSON.parse(stringMessage)
    handleMessage(message)
  } catch (err) {
    console.log('ERR', err)
  }
})
