type State = {
  video: HTMLVideoElement | null
  videoBlob: string | null
  videoHeight: number | null
  videoWidth: number | null
  barUpdateFunction: ReturnType<typeof setInterval> | null
}

class Store {
  private state: State = {
    video: null,
    videoBlob: null,
    videoHeight: null,
    videoWidth: null,
    barUpdateFunction: null,
  }

  resetState = () =>
    this.setState({
      video: null,
      videoBlob: null,
      videoHeight: null,
      videoWidth: null,
      barUpdateFunction: null,
    })

  getState = (): State => this.state

  setState = (partialState: Partial<State>) => {
    this.state = { ...this.state, ...partialState }
  }
}

const store = new Store()

export default store
