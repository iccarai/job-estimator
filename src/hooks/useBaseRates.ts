import type { BaseRate } from '../types'
import { useAppContext } from '../state/AppContext'

export function useBaseRates() {
  const { state, dispatch } = useAppContext()

  function addBaseRate(data: Omit<BaseRate, 'id'>) {
    const rate: BaseRate = { ...data, id: crypto.randomUUID() }
    dispatch({ type: 'ADD_BASE_RATE', payload: rate })
    return rate.id
  }

  function updateBaseRate(rate: BaseRate) {
    dispatch({ type: 'UPDATE_BASE_RATE', payload: rate })
  }

  function deleteBaseRate(id: string) {
    dispatch({ type: 'DELETE_BASE_RATE', payload: id })
  }

  return {
    baseRates: state.baseRates,
    addBaseRate,
    updateBaseRate,
    deleteBaseRate,
  }
}
