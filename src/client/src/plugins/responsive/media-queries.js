import shared from '@/styles/shared-variables.json'
const breakpoints = Object.keys(shared.minBreakpoints).sort(
  (a, b) => shared.minBreakpoints[a] - shared.minBreakpoints[b]
)

const mediaQueryLists = breakpoints.map((breakpoint, index) => {
  let query
  // Biggest breakpoint => only min
  if (index === breakpoints.length - 1) {
    query = `screen and (min-width: ${shared.minBreakpoints[breakpoint] / 16}rem)`
  } else {
    const min = shared.minBreakpoints[breakpoint]
    const max = shared.minBreakpoints[breakpoints[index + 1]] - 1
    query = `screen and (min-width: ${min / 16}rem) and (max-width: ${max / 16}rem)`
  }

  return {
    breakpoint,
    mediaQueryList: window.matchMedia(query),
  }
})

// Here we subscribe to all needed mediaQueries listeners, and return an unsubscribe function
export function addListener(onBreakpointChange) {
  const listeners = []

  // We define a mediaQuery for each available size
  mediaQueryLists.forEach(({ breakpoint, mediaQueryList }) => {
    // We call callback only if the size is now the right one
    function onMediaQueryListChange(evt) {
      if (evt.matches) {
        onBreakpointChange(breakpoint)
      }
    }

    mediaQueryList.addListener(onMediaQueryListChange)

    // We remember listener to be able to remove them
    listeners.push({ listener: onMediaQueryListChange, mediaQueryList })

    // We define the initial state because mediaQuery listeners will not be called until one value changes
    if (mediaQueryList.matches) {
      onBreakpointChange(breakpoint)
    }
  })

  // We return a function to remove all listeners
  return function unsubscribe() {
    listeners.forEach(({ listener, mediaQueryList }) => {
      mediaQueryList.removeListener(listener)
    })
  }
}
