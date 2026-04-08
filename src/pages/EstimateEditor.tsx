import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useEstimates } from '../hooks/useEstimates'
import { useBaseRates } from '../hooks/useBaseRates'
import { computeEstimateTotals } from '../utils/calculations'
import { LineItemRow } from '../components/estimates/LineItemRow'
import { LineItemForm } from '../components/estimates/LineItemForm'
import { TotalsSummary } from '../components/estimates/TotalsSummary'
import { StatusBadge } from '../components/estimates/StatusBadge'
import { Button } from '../components/ui/Button'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { Select } from '../components/ui/Select'
import type { LineItem, EstimateStatus } from '../types'
import { CATEGORIES, CATEGORY_LABELS } from '../constants'

export function EstimateEditor() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { estimates, updateEstimateStatus, deleteEstimate, addLineItem, updateLineItem, deleteLineItem } = useEstimates()
  const { baseRates } = useBaseRates()

  const estimate = estimates.find(e => e.id === id)

  const [showLineItemForm, setShowLineItemForm] = useState(false)
  const [editingItem, setEditingItem] = useState<LineItem | undefined>()
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null)
  const [showDeleteEstimate, setShowDeleteEstimate] = useState(false)

  if (!estimate) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500">Estimate not found.</p>
        <Link to="/" className="text-blue-600 text-sm mt-2 inline-block">← Back to estimates</Link>
      </div>
    )
  }

  const totals = computeEstimateTotals(estimate)

  function handleAddItem(item: Omit<LineItem, 'id'>) {
    if (!id) return
    addLineItem(id, item)
  }

  function handleUpdateItem(item: LineItem) {
    if (!id) return
    updateLineItem(id, item)
  }

  function handleDeleteItem(itemId: string) {
    if (!id) return
    deleteLineItem(id, itemId)
    setDeletingItemId(null)
  }

  function handleDeleteEstimate() {
    if (!estimate) return
    deleteEstimate(estimate.id)
    navigate('/')
  }

  const groupedItems = CATEGORIES
    .map(cat => ({ category: cat, items: estimate.lineItems.filter(li => li.category === cat) }))
    .filter(g => g.items.length > 0)

  return (
    <div className="max-w-5xl">
      <div className="flex items-start justify-between mb-6 gap-4">
        <div>
          <Link to="/" className="text-sm text-gray-500 hover:text-gray-700">← All Estimates</Link>
          <h1 className="text-xl font-bold text-gray-900 mt-1">{estimate.name}</h1>
          <p className="text-sm text-gray-500">{estimate.clientName}</p>
          {estimate.clientEmail && <p className="text-xs text-gray-400">{estimate.clientEmail}</p>}
          {estimate.clientPhone && <p className="text-xs text-gray-400">{estimate.clientPhone}</p>}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <StatusBadge status={estimate.status} />
          <Select
            value={estimate.status}
            onChange={e => updateEstimateStatus(estimate.id, e.target.value as EstimateStatus)}
            options={[
              { value: 'draft', label: 'Draft' },
              { value: 'sent', label: 'Sent' },
              { value: 'accepted', label: 'Accepted' },
              { value: 'rejected', label: 'Rejected' },
            ]}
          />
          <Link to={`/estimate/${estimate.id}/client`}>
            <Button variant="secondary" size="sm">Client View</Button>
          </Link>
          <Button variant="danger" size="sm" onClick={() => setShowDeleteEstimate(true)}>Delete</Button>
        </div>
      </div>

      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-sm font-semibold text-gray-700">Line Items ({estimate.lineItems.length})</h2>
        <Button size="sm" onClick={() => { setEditingItem(undefined); setShowLineItemForm(true) }}>+ Add Item</Button>
      </div>

      {groupedItems.length === 0 ? (
        <div className="text-center py-10 border border-dashed border-gray-300 rounded-xl text-gray-400 mb-6">
          <p className="text-sm">No items yet. Click "+ Add Item" to get started.</p>
        </div>
      ) : (
        <div className="mb-6 space-y-4">
          {groupedItems.map(({ category, items }) => (
            <div key={category}>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{CATEGORY_LABELS[category]}</h3>
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100 text-xs text-gray-500 font-medium">
                      <th className="py-2 px-3">Description</th>
                      <th className="py-2 px-3 text-right">Qty</th>
                      <th className="py-2 px-3 text-right">Cost/Unit</th>
                      <th className="py-2 px-3 text-right">Total Cost</th>
                      <th className="py-2 px-3 text-right">Client Price</th>
                      <th className="py-2 px-3 text-right">Margin</th>
                      <th className="py-2 px-3 w-20"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map(item => (
                      <LineItemRow
                        key={item.id}
                        item={item}
                        onEdit={item => { setEditingItem(item); setShowLineItemForm(true) }}
                        onDelete={id => setDeletingItemId(id)}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}

      {estimate.lineItems.length > 0 && <TotalsSummary totals={totals} />}

      {showLineItemForm && (
        <LineItemForm
          estimateId={estimate.id}
          baseRates={baseRates}
          editingItem={editingItem}
          onSave={editingItem ? handleUpdateItem as never : handleAddItem}
          onClose={() => { setShowLineItemForm(false); setEditingItem(undefined) }}
        />
      )}

      {deletingItemId && (
        <ConfirmDialog
          title="Delete Line Item"
          message="Are you sure you want to delete this line item?"
          onConfirm={() => handleDeleteItem(deletingItemId)}
          onCancel={() => setDeletingItemId(null)}
        />
      )}

      {showDeleteEstimate && (
        <ConfirmDialog
          title="Delete Estimate"
          message={`Are you sure you want to delete "${estimate.name}"? This cannot be undone.`}
          onConfirm={handleDeleteEstimate}
          onCancel={() => setShowDeleteEstimate(false)}
        />
      )}
    </div>
  )
}
