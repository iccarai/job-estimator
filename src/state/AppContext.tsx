import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react'
import type { AppState } from '../types'
import type { Action } from './actions'
import { reducer } from './reducer'
import { loadState, saveState } from '../utils/storage'
import { DEFAULT_BASE_RATES, CURRENT_VERSION } from '../constants'

const initialState: AppState = {
  version: CURRENT_VERSION,
  estimates: [],
  baseRates: DEFAULT_BASE_RATES.map(r => ({ ...r, id: crypto.randomUUID() })),
}

interface AppContextValue {
  state: AppState
  dispatch: (action: Action) => void
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState, () => {
    return loadState() ?? initialState
  })

  useEffect(() => {
    saveState(state)
  }, [state])

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext(): AppContextValue {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useAppContext must be used within AppProvider')
  return ctx
}
