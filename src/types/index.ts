export type CostCategory = 'time' | 'materials' | 'travel' | 'fuel' | 'tools' | 'electronics'

export type RateUnit = 'hour' | 'km' | 'trip' | 'day' | 'unit' | 'litre' | 'flat' | 'job'

export type EstimateStatus = 'draft' | 'sent' | 'accepted' | 'rejected'

export interface BaseRate {
  readonly id: string
  readonly name: string
  readonly category: CostCategory
  readonly unit: RateUnit
  readonly costPerUnit: number
  readonly clientPerUnit: number
}

export interface LineItem {
  readonly id: string
  readonly estimateId: string
  readonly category: CostCategory
  readonly description: string
  readonly quantity: number
  readonly unit: RateUnit
  readonly costPerUnit: number
  readonly clientPerUnit: number
  readonly baseRateId?: string
}

export interface Estimate {
  readonly id: string
  readonly name: string
  readonly clientName: string
  readonly clientEmail?: string
  readonly clientPhone?: string
  readonly notes?: string
  readonly status: EstimateStatus
  readonly lineItems: readonly LineItem[]
  readonly createdAt: string
  readonly updatedAt: string
}

export interface EstimateTotals {
  readonly totalCost: number
  readonly totalClient: number
  readonly totalMargin: number
  readonly marginPercent: number
  readonly byCategory: Partial<Record<CostCategory, { cost: number; client: number }>>
}

export interface AppState {
  readonly version: number
  readonly estimates: readonly Estimate[]
  readonly baseRates: readonly BaseRate[]
}
