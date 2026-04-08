import type { EstimateTotals } from '../../types'
import { CATEGORY_LABELS, CATEGORIES } from '../../constants'
import { formatCurrency, formatPercent } from '../../utils/formatters'

export function TotalsSummary({ totals }: { totals: EstimateTotals }) {
  return (
    <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Cost Breakdown (Internal)</h3>

      <div className="space-y-1 mb-4">
        {CATEGORIES.filter(c => totals.byCategory[c]).map(cat => {
          const { cost, client } = totals.byCategory[cat]!
          return (
            <div key={cat} className="flex justify-between text-sm text-gray-600">
              <span>{CATEGORY_LABELS[cat]}</span>
              <span className="flex gap-6">
                <span className="text-gray-500">cost: {formatCurrency(cost)}</span>
                <span className="text-blue-700">client: {formatCurrency(client)}</span>
              </span>
            </div>
          )
        })}
      </div>

      <div className="border-t border-gray-200 pt-3 space-y-1.5">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Your total cost</span>
          <span className="font-medium text-gray-900">{formatCurrency(totals.totalCost)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Total margin</span>
          <span className="font-medium text-green-700">
            {formatCurrency(totals.totalMargin)} ({formatPercent(totals.marginPercent)})
          </span>
        </div>
        <div className="flex justify-between text-base font-bold border-t border-gray-200 pt-2 mt-2">
          <span>Client Total</span>
          <span className="text-blue-700">{formatCurrency(totals.totalClient)}</span>
        </div>
      </div>
    </div>
  )
}
