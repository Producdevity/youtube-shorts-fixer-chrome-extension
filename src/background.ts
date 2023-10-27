import store from './store.ts'

type MutationObserverCallback = (
  mutations: MutationRecord[],
  observer: MutationObserver,
) => void

type ObserveCallback = MutationObserverCallback | EventListener

const containerClass = 'youtube-shorts-rewind-container'
const colors = {
  red: '#fe0000',
  lightRed: '#ff9b9b',
  white: '#ffffff',
}

const observeDOM = ((): ((
  obj: Node | null,
  callback: MutationObserverCallback,
) => MutationObserver | void) => {
  const MutationObserver =
    window.MutationObserver || window.WebKitMutationObserver

  return function (
    obj: Node | null,
    callback: ObserveCallback,
  ): MutationObserver | void {
    if (obj?.nodeType !== 1) return

    if (MutationObserver) {
      const mutationObserver = new MutationObserver(
        callback as MutationObserverCallback,
      )
      mutationObserver.observe(obj, { childList: true, subtree: true })
      return mutationObserver
    }

    obj.addEventListener('DOMNodeInserted', callback as EventListener, false)
    obj.addEventListener('DOMNodeRemoved', callback as EventListener, false)
  }
})()

const { getState, setState, resetState } = store

const updateVideo = (): void => {
  const videoRewindbar = document.querySelectorAll(`.${containerClass}`)
  videoRewindbar.forEach((bar) => bar.remove())
  const { video, barUpdateFunction } = getState()

  if (barUpdateFunction) {
    clearInterval(barUpdateFunction)
  }

  if (!video || isNaN(video?.duration)) {
    setTimeout(updateVideo, 100)
    return
  }

  const barHeight = 10

  const div = document.createElement('div')
  div.classList.add(containerClass)
  div.style.width = '100%'
  div.style.height = `${barHeight}px`
  div.style.backgroundColor = colors.lightRed
  div.style.position = 'absolute'
  div.style.left = '0'
  div.style.top = `${getState().videoHeight! - barHeight}px`

  const innerDiv = document.createElement('div')
  innerDiv.classList.add(`${containerClass}__inner`)
  innerDiv.style.backgroundColor = colors.red
  innerDiv.style.position = 'absolute'
  innerDiv.style.height = `${barHeight}px`
  innerDiv.style.left = '0'
  innerDiv.style.top = '0'

  // Create the circle div
  // const circleDiv = document.createElement('div')
  // circleDiv.classList.add(`${containerClass}__circle`)
  // circleDiv.style.zIndex = '1000'
  // circleDiv.style.width = '0'
  // circleDiv.style.height = '0'
  // circleDiv.style.opacity = '0'
  // circleDiv.style.borderRadius = '50%'
  // circleDiv.style.backgroundColor = colors.white
  // circleDiv.style.position = 'absolute'
  // circleDiv.style.left = '0' // Update this based on the current position
  // circleDiv.style.top = '15px'
  // circleDiv.style.transition = 'all 0.3s ease' // Add transition
  //
  // div.addEventListener('mouseover', () => {
  //   circleDiv.style.width = '20px'
  //   circleDiv.style.height = '20px'
  //   circleDiv.style.opacity = '1'
  //   circleDiv.style.backgroundColor = colors.red
  // })
  //
  // div.addEventListener('mouseout', () => {
  //   circleDiv.style.width = '0'
  //   circleDiv.style.height = '0'
  //   circleDiv.style.opacity = '0'
  //   circleDiv.style.backgroundColor = colors.white
  // })

  div.append(innerDiv)
  // div.append(circleDiv)

  getState().video?.parentElement?.append(div)

  setState({
    barUpdateFunction: setInterval(() => {
      const progressLength =
        (getState().video!.currentTime / getState().video!.duration) *
        getState().videoWidth!
      innerDiv.style.width = `${progressLength}px`
      // circleDiv.style.left = `${progressLength - 5}px`
    }, 200),
  })

  div.addEventListener('click', (ev) => {
    ev.stopPropagation()
    const leftOffset = getState().video!.getBoundingClientRect().left
    const fractionClicked = (ev.clientX - leftOffset) / getState().videoWidth!
    getState().video!.currentTime = fractionClicked * getState().video!.duration
  })
}

function updateVideoSize(): void {
  const currentVideo: HTMLDivElement | null = document.querySelector(
    '.ytd-reel-video-renderer #player .html5-video-player',
  )
  if (!currentVideo) return

  setState({
    videoHeight: currentVideo.offsetHeight,
    videoWidth: currentVideo.offsetWidth,
  })
}

function destroy(): void {
  const videoRewindbar = document.querySelectorAll(`.${containerClass}`)
  videoRewindbar.forEach((bar) => bar.remove())

  const { barUpdateFunction } = getState()

  if (barUpdateFunction) {
    clearInterval(barUpdateFunction)
  }

  resetState()
}

observeDOM(document.querySelector('body'), () => {
  const videoList = document.querySelectorAll<HTMLVideoElement>(
    '.ytd-reel-video-renderer #player .video-stream.html5-main-video[src]',
  )
  if (videoList.length === 0 && getState().video) {
    destroy()
    return
  }

  if (!getState().video && videoList.length > 0) {
    getState().video = videoList[0]
    getState().videoBlob = getState().video?.src || null
    updateVideoSize()
    updateVideo()
  } else if (getState().video?.src !== getState().videoBlob) {
    getState().videoBlob = getState().video?.src || null
    updateVideoSize()
    updateVideo()
  } else {
    updateVideoSize()
  }
})
