import type { Estimate, LineItem, BaseRate, AppState } from '../types'

export type Action =
  | { type: 'LOAD_STATE'; payload: AppState }
  | { type: 'ADD_ESTIMATE'; payload: Estimate }
  | { type: 'UPDATE_ESTIMATE'; payload: Estimate }
  | { type: 'DELETE_ESTIMATE'; payload: string }
  | { type: 'ADD_LINE_ITEM'; payload: { estimateId: string; item: LineItem } }
  | { type: 'UPDATE_LINE_ITEM'; payload: { estimateId: string; item: LineItem } }
  | { type: 'DELETE_LINE_ITEM'; payload: { estimateId: string; itemId: string } }
  | { type: 'ADD_BASE_RATE'; payload: BaseRate }
  | { type: 'UPDATE_BASE_RATE'; payload: BaseRate }
  | { type: 'DELETE_BASE_RATE'; payload: string }
