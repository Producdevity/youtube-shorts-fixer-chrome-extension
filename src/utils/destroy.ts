import { containerClass } from '../data.ts'
import store from '../store.ts'

function destroy() {
  const videoRewindbar = document.querySelectorAll(`.${containerClass}`)
  videoRewindbar.forEach((bar) => bar.remove())

  const { barUpdateFunction } = store.getState()

  if (barUpdateFunction) {
    clearInterval(barUpdateFunction)
  }

  store.resetState()
}

export default destroy
