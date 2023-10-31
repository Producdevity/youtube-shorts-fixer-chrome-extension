import store from '../store.ts'

function updateVideoSize() {
  const currentVideo: HTMLDivElement | null = document.querySelector(
    '.ytd-reel-video-renderer #player .html5-video-player',
  )
  if (!currentVideo) return

  store.setState({
    videoHeight: currentVideo.offsetHeight,
    videoWidth: currentVideo.offsetWidth,
  })
}

export default updateVideoSize
