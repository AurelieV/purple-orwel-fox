chrome.runtime.onInstalled.addListener(function () {
  const DATA = {
    token: null,
    user: null,
  }

  function resetUser() {
    DATA.token = null
    DATA.user = null
    chrome.storage.local.set({ isAuthenticated: false, user: null })
  }

  // Init variables
  chrome.storage.local.set({ isListening: false, isAuthenticated: false })

  chrome.tabs.query({ url: 'https://www.deezer.com/*' }, (tabs) => {
    tabs.forEach((tab) => {
      console.log('Init tabs', tabs)
      chrome.pageAction.show(tab.id)
    })
  })
  chrome.tabs.onUpdated.addListener((tabId, update, tab) => {
    if (!update.url && !update.status) return
    if (tab.url.includes('https://www.deezer.com/')) {
      chrome.pageAction.show(tabId)
    } else {
      chrome.pageAction.hide(tabId)
    }
  })
  chrome.runtime.onMessage.addListener((message, sender) => {
    if (typeof message !== 'object') return
    switch (message.type) {
      case 'STATUS_CHANGED':
        chrome.storage.local.set({ isListening: message.val })
        break
      case 'TRACK_CHANGED':
        chrome.storage.local.set({ currentTrack: message.val })
        break
      case 'LOGOUT':
        resetUser()
      case 'AUTHENTICATE_WITH_CODE':
        fetch('https://twitch-api.purple-fox.fr/chrome/login', {
          method: 'POST',
          body: JSON.stringify({ code: message.val }),
        })
          .then((res) => (res.ok ? res.json() : Promise.reject(res)))
          .then(({ token, user }) => {
            DATA.token = token
            DATA.user = user
            chrome.storage.local.set({ isAuthenticated: true, user })
          })
          .catch(() => resetUser())
        break
    }
  })
  chrome.storage.onChanged.addListener((changes) => {
    if (changes.isListening) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tabId = tabs[0].id
        const isListening = changes.isListening.newValue
        chrome.pageAction.setIcon({
          path: `icons/Icon${isListening ? 'Running' : 'Start'}.png`,
          tabId,
        })
      })
    }
    if (changes.currentTrack) {
      console.log('change track for', DATA.user)
      if (!DATA.token || !DATA.user) return
      fetch(`https://twitch-api.purple-fox.fr/chrome/${DATA.user.id}/track`, {
        method: 'POST',
        body: JSON.stringify(changes.currentTrack.newValue),
        headers: {
          Authorization: `Bearer ${DATA.token}`,
        },
      }).then((res) => {
        if (res.status === 401) {
          resetUser()
        }
      })
    }
  })
})
