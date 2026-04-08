import type { Estimate } from '../../types'
import { computeEstimateTotals, computeLineItemTotals } from '../../utils/calculations'
import { formatCurrency, formatDate } from '../../utils/formatters'
import { CATEGORY_LABELS, CATEGORIES } from '../../constants'

export function ClientEstimate({ estimate }: { estimate: Estimate }) {
  const totals = computeEstimateTotals(estimate)

  const groupedItems = CATEGORIES
    .filter(cat => totals.byCategory[cat])
    .map(cat => ({
      category: cat,
      items: estimate.lineItems.filter(item => item.category === cat),
    }))

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Estimate</h1>
        <p className="text-gray-500 text-sm mt-1">Prepared {formatDate(estimate.updatedAt)}</p>
      </div>

      <div className="mb-6">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500 font-medium">Prepared for</p>
            <p className="text-gray-900 font-semibold">{estimate.clientName}</p>
            {estimate.clientEmail && <p className="text-gray-600">{estimate.clientEmail}</p>}
            {estimate.clientPhone && <p className="text-gray-600">{estimate.clientPhone}</p>}
          </div>
          <div>
            <p className="text-gray-500 font-medium">Job</p>
            <p className="text-gray-900 font-semibold">{estimate.name}</p>
          </div>
        </div>
      </div>

      <div className="mb-8">
        {groupedItems.map(({ category, items }) => (
          <div key={category} className="mb-4">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 border-b pb-1">
              {CATEGORY_LABELS[category]}
            </h3>
            <table className="w-full text-sm">
              <tbody>
                {items.map(item => {
                  const { totalClient } = computeLineItemTotals(item)
                  return (
                    <tr key={item.id} className="border-b border-gray-50">
                      <td className="py-1.5 text-gray-800">{item.description}</td>
                      <td className="py-1.5 text-gray-500 text-right pr-6">{item.quantity} × {formatCurrency(item.clientPerUnit)}</td>
                      <td className="py-1.5 font-medium text-gray-900 text-right">{formatCurrency(totalClient)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ))}
      </div>

      <div className="border-t-2 border-gray-900 pt-4">
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-gray-900">Total</span>
          <span className="text-2xl font-bold text-gray-900">{formatCurrency(totals.totalClient)}</span>
        </div>
        <p className="text-xs text-gray-400 mt-1">All prices in CAD. This estimate is valid for 30 days.</p>
      </div>

      {estimate.notes && (
        <div className="mt-6 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Notes</p>
          <p className="text-sm text-gray-700 whitespace-pre-wrap">{estimate.notes}</p>
        </div>
      )}
    </div>
  )
}
