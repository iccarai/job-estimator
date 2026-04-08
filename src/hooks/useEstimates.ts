import type { Estimate, LineItem, EstimateStatus } from '../types'
import { useAppContext } from '../state/AppContext'

export function useEstimates() {
  const { state, dispatch } = useAppContext()

  function addEstimate(data: Omit<Estimate, 'id' | 'lineItems' | 'createdAt' | 'updatedAt' | 'status'>) {
    const now = new Date().toISOString()
    const estimate: Estimate = {
      ...data,
      id: crypto.randomUUID(),
      status: 'draft',
      lineItems: [],
      createdAt: now,
      updatedAt: now,
    }
    dispatch({ type: 'ADD_ESTIMATE', payload: estimate })
    return estimate.id
  }

  function updateEstimate(estimate: Estimate) {
    dispatch({ type: 'UPDATE_ESTIMATE', payload: estimate })
  }

  function updateEstimateStatus(estimateId: string, status: EstimateStatus) {
    const estimate = state.estimates.find(e => e.id === estimateId)
    if (!estimate) return
    dispatch({ type: 'UPDATE_ESTIMATE', payload: { ...estimate, status } })
  }

  function deleteEstimate(id: string) {
    dispatch({ type: 'DELETE_ESTIMATE', payload: id })
  }

  function addLineItem(estimateId: string, item: Omit<LineItem, 'id'>) {
    dispatch({
      type: 'ADD_LINE_ITEM',
      payload: { estimateId, item: { ...item, id: crypto.randomUUID() } },
    })
  }

  function updateLineItem(estimateId: string, item: LineItem) {
    dispatch({ type: 'UPDATE_LINE_ITEM', payload: { estimateId, item } })
  }

  function deleteLineItem(estimateId: string, itemId: string) {
    dispatch({ type: 'DELETE_LINE_ITEM', payload: { estimateId, itemId } })
  }

  return {
    estimates: state.estimates,
    addEstimate,
    updateEstimate,
    updateEstimateStatus,
    deleteEstimate,
    addLineItem,
    updateLineItem,
    deleteLineItem,
  }
}
