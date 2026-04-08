import type { LineItem } from '../../types'
import { CATEGORY_COLORS, CATEGORY_LABELS, UNIT_LABELS } from '../../constants'
import { formatCurrency, formatPercent } from '../../utils/formatters'
import { computeLineItemTotals } from '../../utils/calculations'
import { Button } from '../ui/Button'

interface LineItemRowProps {
  item: LineItem
  onEdit: (item: LineItem) => void
  onDelete: (id: string) => void
}

export function LineItemRow({ item, onEdit, onDelete }: LineItemRowProps) {
  const { totalCost, totalClient, margin } = computeLineItemTotals(item)
  const marginPct = totalCost > 0 ? (margin / totalCost) * 100 : 0

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50 group">
      <td className="py-2 px-3">
        <div className="font-medium text-gray-900 text-sm">{item.description}</div>
        <span className={`inline-block mt-0.5 px-1.5 py-0.5 rounded text-xs font-medium ${CATEGORY_COLORS[item.category]}`}>
          {CATEGORY_LABELS[item.category]}
        </span>
      </td>
      <td className="py-2 px-3 text-sm text-gray-600 text-right whitespace-nowrap">
        {item.quantity} {UNIT_LABELS[item.unit]}
      </td>
      <td className="py-2 px-3 text-sm text-gray-500 text-right">{formatCurrency(item.costPerUnit)}</td>
      <td className="py-2 px-3 text-sm text-gray-900 font-medium text-right">{formatCurrency(totalCost)}</td>
      <td className="py-2 px-3 text-sm text-blue-700 font-medium text-right">{formatCurrency(totalClient)}</td>
      <td className="py-2 px-3 text-sm text-green-700 text-right whitespace-nowrap">
        {formatCurrency(margin)} ({formatPercent(marginPct)})
      </td>
      <td className="py-2 px-3">
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="sm" onClick={() => onEdit(item)}>Edit</Button>
          <Button variant="ghost" size="sm" onClick={() => onDelete(item.id)} className="text-red-600 hover:bg-red-50">Del</Button>
        </div>
      </td>
    </tr>
  )
}
