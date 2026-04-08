import type { AppState, Estimate } from '../types'
import type { Action } from './actions'

function updateEstimate(estimates: readonly Estimate[], estimateId: string, updater: (e: Estimate) => Estimate): readonly Estimate[] {
  return estimates.map(e => e.id === estimateId ? updater(e) : e)
}

export function reducer(state: AppState, action: Action): AppState {
  const now = new Date().toISOString()

  switch (action.type) {
    case 'LOAD_STATE':
      return action.payload

    case 'ADD_ESTIMATE':
      return { ...state, estimates: [...state.estimates, action.payload] }

    case 'UPDATE_ESTIMATE':
      return {
        ...state,
        estimates: state.estimates.map(e =>
          e.id === action.payload.id ? { ...action.payload, updatedAt: now } : e
        ),
      }

    case 'DELETE_ESTIMATE':
      return { ...state, estimates: state.estimates.filter(e => e.id !== action.payload) }

    case 'ADD_LINE_ITEM':
      return {
        ...state,
        estimates: updateEstimate(state.estimates, action.payload.estimateId, e => ({
          ...e,
          updatedAt: now,
          lineItems: [...e.lineItems, action.payload.item],
        })),
      }

    case 'UPDATE_LINE_ITEM':
      return {
        ...state,
        estimates: updateEstimate(state.estimates, action.payload.estimateId, e => ({
          ...e,
          updatedAt: now,
          lineItems: e.lineItems.map(li =>
            li.id === action.payload.item.id ? action.payload.item : li
          ),
        })),
      }

    case 'DELETE_LINE_ITEM':
      return {
        ...state,
        estimates: updateEstimate(state.estimates, action.payload.estimateId, e => ({
          ...e,
          updatedAt: now,
          lineItems: e.lineItems.filter(li => li.id !== action.payload.itemId),
        })),
      }

    case 'ADD_BASE_RATE':
      return { ...state, baseRates: [...state.baseRates, action.payload] }

    case 'UPDATE_BASE_RATE':
      return {
        ...state,
        baseRates: state.baseRates.map(r => r.id === action.payload.id ? action.payload : r),
      }

    case 'DELETE_BASE_RATE':
      return { ...state, baseRates: state.baseRates.filter(r => r.id !== action.payload) }

    default:
      return state
  }
}
