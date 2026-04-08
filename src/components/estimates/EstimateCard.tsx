import { Link } from 'react-router-dom'
import type { Estimate } from '../../types'
import { computeEstimateTotals } from '../../utils/calculations'
import { formatCurrency, formatDate } from '../../utils/formatters'
import { StatusBadge } from './StatusBadge'
import { Card } from '../ui/Card'

export function EstimateCard({ estimate }: { estimate: Estimate }) {
  const totals = computeEstimateTotals(estimate)

  return (
    <Link to={`/estimate/${estimate.id}`}>
      <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <h3 className="font-semibold text-gray-900">{estimate.name}</h3>
            <p className="text-sm text-gray-500">{estimate.clientName}</p>
          </div>
          <StatusBadge status={estimate.status} />
        </div>
        <div className="flex items-end justify-between mt-3">
          <div>
            <p className="text-xs text-gray-400">{estimate.lineItems.length} item{estimate.lineItems.length !== 1 ? 's' : ''}</p>
            <p className="text-xs text-gray-400">Updated {formatDate(estimate.updatedAt)}</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-blue-700">{formatCurrency(totals.totalClient)}</p>
            <p className="text-xs text-gray-400">margin {formatCurrency(totals.totalMargin)}</p>
          </div>
        </div>
      </Card>
    </Link>
  )
}
