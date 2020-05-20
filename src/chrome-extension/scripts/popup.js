const CLIENT_ID = 'b8bh0bh0s60fc5ivzm2nyvkk6tqray'

const TOGGLE_STATUS_BTN = document.getElementById('toggle-status')
const CONNECT_BTN = document.getElementById('connect')
const CONNECTED_CONTAINER = document.getElementById('connected-container')
const NOT_CONNECTED_CONTAINER = document.getElementById('not-connected-container')
const CURRENT_TRACK = document.getElementById('current-track')
const LOGOUT_BTN = document.getElementById('logout')
const ERROR_CONTAINER = document.getElementById('error')
const USER_IMG = document.getElementById('user_img')
const USER_LOGIN = document.getElementById('user_login')

const DATA = {
  isAuthenticated: false,
  isListening: false,
  currentTrack: null,
}

function onIsListeningChange(isListening) {
  TOGGLE_STATUS_BTN.innerHTML = isListening ? 'Stop Synchro' : 'Start synchro'
  CURRENT_TRACK.hidden = !isListening
  DATA.isListening = isListening
}

function onIsAuthenticatedChange(isAuthenticated) {
  NOT_CONNECTED_CONTAINER.hidden = isAuthenticated
  CONNECTED_CONTAINER.hidden = !isAuthenticated
  DATA.isAuthenticated = isAuthenticated
}

function onCurrentTrackChange(currentTrack) {
  if (!currentTrack) {
    CURRENT_TRACK.innerHTML = ''
  } else {
    const { ART_NAME, SNG_TITLE } = currentTrack
    CURRENT_TRACK.innerHTML = `${SNG_TITLE}, by ${ART_NAME}`
  }
  DATA.currentTrack = currentTrack
}

function onUserChange(user) {
  if (!user) return
  USER_IMG.src = user.profile_image_url
  USER_LOGIN.innerHTML = user.display_name
}

function changeIsLoading(isLoading) {
  CONNECT_BTN.disabled = isLoading
}

function setError(error) {
  ERROR_CONTAINER.innerHTML = error
}

function sendMessageToTab(message) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, message)
  })
}

TOGGLE_STATUS_BTN.addEventListener('click', function () {
  chrome.storage.local.set({ isListening: !DATA.isListening })
})
LOGOUT_BTN.addEventListener('click', function () {
  chrome.runtime.sendMessage({ type: 'LOGOUT' })
})
CONNECT_BTN.addEventListener('click', function () {
  changeIsLoading(true)
  setError('')
  const redirectUri = chrome.identity.getRedirectURL('twitch_redirect')
  const url = `https://id.twitch.tv/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&response_type=code&scope=openid`
  chrome.identity.launchWebAuthFlow({ url, interactive: true }, (responseUrl) => {
    if (chrome.runtime.lastError) {
      console.log(chrome.runtime.lastError)
      return
    }
    const [, queryString] = responseUrl.split('?')
    const params = new URLSearchParams(queryString)
    const code = params.get('code')
    chrome.runtime.sendMessage({ type: 'AUTHENTICATE_WITH_CODE', val: code })
  })
})

chrome.storage.onChanged.addListener((changes) => {
  if (changes.isListening) {
    onIsListeningChange(changes.isListening.newValue)
  }
  if (changes.isAuthenticated) {
    onIsAuthenticatedChange(changes.isAuthenticated.newValue)
  }
  if (changes.currentTrack) {
    onCurrentTrackChange(changes.currentTrack.newValue)
  }
  if (changes.user) {
    onUserChange(changes.user.newValue)
  }
})

// Initialise data
chrome.storage.local.get(
  ['isListening', 'isAuthenticated', 'currentTrack', 'user'],
  ({ isListening, isAuthenticated, currentTrack, user }) => {
    onIsListeningChange(isListening)
    onIsAuthenticatedChange(isAuthenticated)
    onCurrentTrackChange(currentTrack)
    onUserChange(user)
  }
)
