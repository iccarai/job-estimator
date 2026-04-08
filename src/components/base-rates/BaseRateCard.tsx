import type { BaseRate } from '../../types'
import { CATEGORY_COLORS, CATEGORY_LABELS, UNIT_LABELS } from '../../constants'
import { formatCurrency, formatPercent } from '../../utils/formatters'
import { Button } from '../ui/Button'

interface BaseRateCardProps {
  rate: BaseRate
  onEdit: (rate: BaseRate) => void
  onDelete: (id: string) => void
}

export function BaseRateCard({ rate, onEdit, onDelete }: BaseRateCardProps) {
  const margin = rate.clientPerUnit - rate.costPerUnit
  const marginPct = rate.costPerUnit > 0 ? (margin / rate.costPerUnit) * 100 : 0

  return (
    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors group">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="font-medium text-gray-900 text-sm">{rate.name}</span>
          <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${CATEGORY_COLORS[rate.category]}`}>
            {CATEGORY_LABELS[rate.category]}
          </span>
        </div>
        <div className="flex gap-4 text-xs text-gray-500">
          <span>per {UNIT_LABELS[rate.unit]}</span>
          <span>cost: {formatCurrency(rate.costPerUnit)}</span>
          <span className="text-blue-600">client: {formatCurrency(rate.clientPerUnit)}</span>
          <span className="text-green-600">+{formatPercent(marginPct)}</span>
        </div>
      </div>
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button variant="ghost" size="sm" onClick={() => onEdit(rate)}>Edit</Button>
        <Button variant="ghost" size="sm" onClick={() => onDelete(rate.id)} className="text-red-600 hover:bg-red-50">Del</Button>
      </div>
    </div>
  )
}
