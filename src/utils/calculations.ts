import type { LineItem, Estimate, EstimateTotals, BaseRate, CostCategory } from '../types'
import { MATERIALS_UPCHARGE } from '../constants'

export function round2(n: number): number {
  return Math.round(n * 100) / 100
}

export function applyMaterialsUpcharge(costPerUnit: number): number {
  return round2(costPerUnit * MATERIALS_UPCHARGE)
}

export function computeLineItemTotals(item: LineItem) {
  const totalCost = round2(item.quantity * item.costPerUnit)
  const totalClient = round2(item.quantity * item.clientPerUnit)
  return { totalCost, totalClient, margin: round2(totalClient - totalCost) }
}

export function computeEstimateTotals(estimate: Estimate): EstimateTotals {
  const byCategory: Partial<Record<CostCategory, { cost: number; client: number }>> = {}
  let totalCost = 0
  let totalClient = 0

  for (const item of estimate.lineItems) {
    const { totalCost: c, totalClient: cl } = computeLineItemTotals(item)
    totalCost += c
    totalClient += cl

    const existing = byCategory[item.category] ?? { cost: 0, client: 0 }
    byCategory[item.category] = {
      cost: round2(existing.cost + c),
      client: round2(existing.client + cl),
    }
  }

  totalCost = round2(totalCost)
  totalClient = round2(totalClient)
  const totalMargin = round2(totalClient - totalCost)
  const marginPercent = totalCost > 0 ? round2((totalMargin / totalCost) * 100) : 0

  return { totalCost, totalClient, totalMargin, marginPercent, byCategory }
}

export function lineItemFromBaseRate(
  baseRate: BaseRate,
  estimateId: string,
  quantity: number,
  description?: string
): Omit<LineItem, 'id'> {
  return {
    estimateId,
    category: baseRate.category,
    description: description ?? baseRate.name,
    quantity,
    unit: baseRate.unit,
    costPerUnit: baseRate.costPerUnit,
    clientPerUnit: baseRate.clientPerUnit,
    baseRateId: baseRate.id,
  }
}
