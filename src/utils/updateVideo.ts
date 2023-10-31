import { colors, containerClass } from '../data.ts'
import store from '../store.ts'

const { getState, setState } = store

function updateCurrentTime(ev: MouseEvent) {
  const { video, videoWidth } = getState()

  if (!video) return console.warn('[YSF]: Video not found')

  const leftOffset = video.getBoundingClientRect().left
  const fractionClicked = (ev.clientX - leftOffset) / videoWidth!
  setState({
    video: {
      ...video,
      currentTime: fractionClicked * video.duration,
    },
  })
}

function updateVideo() {
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
    updateCurrentTime(ev)
  })
}

export default updateVideo
