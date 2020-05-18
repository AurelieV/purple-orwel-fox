window.PURPLE_ORWEL = window.PURPLE_ORWEL || {}

window.PURPLE_ORWEL.sendMessage = (message) => {
  document.dispatchEvent(
    new CustomEvent('PURPLE_ORWEL_MSG', { detail: { ...message, origin: 'BROWSER' } })
  )
}

window.PURPLE_ORWEL.changeStatus = (val) => {
  window.PURPLE_ORWEL.isListening = val
  window.PURPLE_ORWEL.sendMessage({ type: 'STATUS_CHANGED', val })
}

window.PURPLE_ORWEL.changeStatus(false)

window.PURPLE_ORWEL.changeTrack = (track) => {
  console.log('PURPLE_ORWEL: Change track: ', track)
  window.PURPLE_ORWEL.sendMessage({ type: 'TRACK_CHANGED', val: track })
}

window.PURPLE_ORWEL.onDisplayCurrentSong = (e, track) => {
  window.PURPLE_ORWEL.changeTrack(track)
}

window.PURPLE_ORWEL.start = () => {
  const currentSong = window.dzPlayer.getCurrentSong()
  window.PURPLE_ORWEL.changeTrack(currentSong)
  if (window.PURPLE_ORWEL.isListening) return
  console.log('PURPLE_ORWEL: Start Listening')
  window.Events.subscribe(
    window.Events.player.displayCurrentSong,
    window.PURPLE_ORWEL.onDisplayCurrentSong
  )
  window.PURPLE_ORWEL.changeStatus(true)
}

window.PURPLE_ORWEL.stop = () => {
  if (!window.PURPLE_ORWEL.isListening) return
  console.log('PURPLE_ORWEL: Stop Listening')
  window.Events.unsubscribe(
    window.Events.player.displayCurrentSong,
    window.PURPLE_ORWEL.onDisplayCurrentSong
  )
  window.PURPLE_ORWEL.changeStatus(false)
}

document.addEventListener('PURPLE_ORWEL_MSG', ({ detail }) => {
  const { type, origin } = detail
  console.log('recevied message', detail)
  if (origin === 'BROWSER') return
  switch (type) {
    case 'TOGGLE_STATUS':
      if (window.PURPLE_ORWEL.isListening) {
        window.PURPLE_ORWEL.stop()
      } else {
        window.PURPLE_ORWEL.start()
      }
      break
  }
})
