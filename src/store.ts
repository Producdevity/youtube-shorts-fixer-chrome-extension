type State = {
  video: HTMLVideoElement | null
  videoBlob: string | null
  videoHeight: number | null
  videoWidth: number | null
  barUpdateFunction: ReturnType<typeof setInterval> | null
}

type SetStateAction =
  | Partial<State>
  | ((prevState: Readonly<State>) => Partial<State>)

class Store {
  private readonly initialState: State = {
    video: null,
    videoBlob: null,
    videoHeight: null,
    videoWidth: null,
    barUpdateFunction: null,
  }

  private state: State = { ...this.initialState }

  resetState = (): State => this.setState({ ...this.initialState })

  getState = (): State => this.state

  setState = (newStateOrUpdater: SetStateAction): State =>
    (this.state = {
      ...this.state,
      ...(typeof newStateOrUpdater === 'function'
        ? newStateOrUpdater(this.state)
        : newStateOrUpdater),
    })
}

const store = new Store()

export default store
