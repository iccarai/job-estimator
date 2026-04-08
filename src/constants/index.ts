import type { CostCategory, RateUnit, BaseRate } from '../types'

export const MATERIALS_UPCHARGE = 1.3
export const STORAGE_KEY = 'job-estimator-v1'
export const CURRENT_VERSION = 1

export const CATEGORY_LABELS: Record<CostCategory, string> = {
  time: 'Labour / Time',
  materials: 'Materials',
  travel: 'Travel',
  fuel: 'Fuel',
  tools: 'Tools',
  electronics: 'Electronics',
}

export const CATEGORY_COLORS: Record<CostCategory, string> = {
  time: 'bg-blue-100 text-blue-800',
  materials: 'bg-amber-100 text-amber-800',
  travel: 'bg-green-100 text-green-800',
  fuel: 'bg-orange-100 text-orange-800',
  tools: 'bg-purple-100 text-purple-800',
  electronics: 'bg-teal-100 text-teal-800',
}

export const CATEGORIES: CostCategory[] = ['time', 'materials', 'travel', 'fuel', 'tools', 'electronics']

export const UNIT_LABELS: Record<RateUnit, string> = {
  hour: 'hour',
  km: 'km',
  trip: 'trip',
  day: 'day',
  unit: 'unit',
  litre: 'litre',
  flat: 'flat',
  job: 'job',
}

export const UNITS: RateUnit[] = ['hour', 'km', 'trip', 'day', 'unit', 'litre', 'flat', 'job']

export const DEFAULT_BASE_RATES: Omit<BaseRate, 'id'>[] = [
  { name: 'Standard Hourly Rate', category: 'time', unit: 'hour', costPerUnit: 65, clientPerUnit: 65 },
  { name: 'Fuel per km', category: 'fuel', unit: 'km', costPerUnit: 0.15, clientPerUnit: 0.20 },
  { name: 'Local Travel (flat)', category: 'travel', unit: 'trip', costPerUnit: 25, clientPerUnit: 35 },
  { name: 'Mitre Saw (day)', category: 'tools', unit: 'day', costPerUnit: 15, clientPerUnit: 25 },
  { name: 'Drill (day)', category: 'tools', unit: 'day', costPerUnit: 5, clientPerUnit: 10 },
  { name: 'Laser Level (day)', category: 'electronics', unit: 'day', costPerUnit: 10, clientPerUnit: 18 },
  { name: 'Work Phone Usage', category: 'electronics', unit: 'day', costPerUnit: 3, clientPerUnit: 5 },
]
