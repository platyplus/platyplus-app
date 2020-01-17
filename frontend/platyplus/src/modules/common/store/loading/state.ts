interface ProgressState {
  progress: number
  target: number
  message?: string
}

export interface LoaderState {
  loading: boolean
  progress: Map<string, ProgressState>
  message?: string
}

export const state: LoaderState = {
  loading: false,
  progress: new Map<string, ProgressState>(),
  message: undefined
}
