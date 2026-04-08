import { useState } from 'react'
import { useBaseRates } from '../hooks/useBaseRates'
import { BaseRateCard } from '../components/base-rates/BaseRateCard'
import { BaseRateForm } from '../components/base-rates/BaseRateForm'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { Button } from '../components/ui/Button'
import type { BaseRate } from '../types'
import { CATEGORIES, CATEGORY_LABELS } from '../constants'

export function BaseRateManager() {
  const { baseRates, addBaseRate, updateBaseRate, deleteBaseRate } = useBaseRates()
  const [showForm, setShowForm] = useState(false)
  const [editingRate, setEditingRate] = useState<BaseRate | undefined>()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  function handleSave(data: Omit<BaseRate, 'id'>) {
    if (editingRate) {
      updateBaseRate({ ...data, id: editingRate.id })
    } else {
      addBaseRate(data)
    }
  }

  const deletingRate = baseRates.find(r => r.id === deletingId)

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Base Rates</h1>
          <p className="text-sm text-gray-500 mt-0.5">Pre-set cost rates you can quickly add to any estimate</p>
        </div>
        <Button onClick={() => { setEditingRate(undefined); setShowForm(true) }}>+ Add Rate</Button>
      </div>

      {baseRates.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-gray-300 rounded-xl text-gray-400">
          <p className="text-4xl mb-3">⚙️</p>
          <p className="font-medium">No base rates configured</p>
          <p className="text-sm mt-1">Add rates for fuel, tools, hourly labour, etc.</p>
          <Button className="mt-4" onClick={() => { setEditingRate(undefined); setShowForm(true) }}>+ Add Rate</Button>
        </div>
      ) : (
        <div className="space-y-6">
          {CATEGORIES.filter(cat => baseRates.some(r => r.category === cat)).map(cat => (
            <div key={cat}>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">{CATEGORY_LABELS[cat]}</h2>
              <div className="space-y-2">
                {baseRates.filter(r => r.category === cat).map(rate => (
                  <BaseRateCard
                    key={rate.id}
                    rate={rate}
                    onEdit={r => { setEditingRate(r); setShowForm(true) }}
                    onDelete={id => setDeletingId(id)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <BaseRateForm
          editingRate={editingRate}
          onSave={handleSave}
          onClose={() => { setShowForm(false); setEditingRate(undefined) }}
        />
      )}

      {deletingId && deletingRate && (
        <ConfirmDialog
          title="Delete Base Rate"
          message={`Delete "${deletingRate.name}"? Existing estimates won't be affected.`}
          onConfirm={() => { deleteBaseRate(deletingId); setDeletingId(null) }}
          onCancel={() => setDeletingId(null)}
        />
      )}
    </div>
  )
}
