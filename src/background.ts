import destroy from './utils/destroy.ts'
import store from './store.ts'
import updateVideo from './utils/updateVideo.ts'
import updateVideoSize from './utils/updateVideoSize.ts'

type MutationObserverCallback = (
  mutations: MutationRecord[],
  observer: MutationObserver,
) => void

type ObserveCallback = MutationObserverCallback | EventListener

const observeDOM = ((): ((
  element: Node | null,
  callback: MutationObserverCallback,
) => MutationObserver | void) => {
  const MutationObserver =
    window.MutationObserver || window.WebKitMutationObserver

  return function (
    element: Node | null,
    callback: ObserveCallback,
  ): MutationObserver | void {
    if (element?.nodeType !== 1) return

    if (MutationObserver) {
      const mutationObserver = new MutationObserver(
        callback as MutationObserverCallback,
      )
      mutationObserver.observe(element, { childList: true, subtree: true })
      return mutationObserver
    }

    element.addEventListener(
      'DOMNodeInserted',
      callback as EventListener,
      false,
    )
    element.addEventListener('DOMNodeRemoved', callback as EventListener, false)
  }
})()

const { getState, setState } = store

// TODO: Implement scrubbing functionality using arrow keys
// TODO: Update scrubbing bar in real-time during drag action

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
    setState({ videoBlob: getState().video?.src || null })
    updateVideoSize()
    updateVideo()
  } else {
    updateVideoSize()
  }
})
