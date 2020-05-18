let isListening = false
let isAuthenticated = false

const CLIENT_ID = 'b8bh0bh0s60fc5ivzm2nyvkk6tqray'

function getStatusBtn() {
  return document.getElementById('toggle-status')
}
function getConnectBtn() {
  return document.getElementById('connect')
}

function changeStatus(val) {
  isListening = val
  document.getElementById('status').innerHTML = isListening
    ? 'Synchronisation active'
    : 'Synchronisation interrompue'
  getStatusBtn().innerHTML = isListening ? 'Stop Synchro' : 'Start synchro'
}

function changeIsAuthenticated(val) {
  isAuthenticated = val
  document.getElementById('not-connected-container').hidden = val
  document.getElementById('connected-container').hidden = !val
}

function getActiveTab(cb) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => cb(tabs[0]))
}

function sendMessageToTab(message) {
  getActiveTab((tab) => {
    chrome.tabs.sendMessage(tab.id, message)
  })
}

getStatusBtn().addEventListener('click', function () {
  sendMessageToTab({ type: 'TOGGLE_STATUS' })
})
getConnectBtn().addEventListener('click', function () {
  const redirectUri = chrome.identity.getRedirectURL('twitch_redirect')
  const url = `https://id.twitch.tv/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&response_type=code&scope=openid`
  console.log('url', url)
  chrome.identity.launchWebAuthFlow({ url, interactive: true }, (responseUrl) => {
    if (chrome.runtime.lastError) {
      console.log(chrome.runtime.lastError)
      return
    }
    const [, queryString] = responseUrl.split('?')
    const params = new URLSearchParams(queryString)
    const code = params.get('code')
    fetch('https://twitch-api.purple-fox.fr/admin/login', {
      method: 'POST',
      mode: 'no-cors',
      body: JSON.stringify({ code }),
    })
      .then(() => {
        console.log('Token sucessfull')
      })
      .catch((err) => {
        console.error('Error', err)
      })
  })
})
chrome.runtime.sendMessage({ type: 'GET_STATUS' }, (val) => changeStatus(val))
chrome.runtime.sendMessage({ type: 'GET_IS_AUTHENTICATED' }, (val) => changeIsAuthenticated(val))

chrome.runtime.onMessage.addListener((message, sender) => {
  console.log('message received to popup', message)
  if (typeof message !== 'object') return
  switch (message.type) {
    case 'STATUS_CHANGED':
      changeStatus(message.val)
      break
  }
})
