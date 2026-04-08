import { useState, useEffect } from 'react'
import type { LineItem, CostCategory, RateUnit, BaseRate } from '../../types'
import { CATEGORIES, CATEGORY_LABELS, UNITS, UNIT_LABELS, MATERIALS_UPCHARGE } from '../../constants'
import { applyMaterialsUpcharge, round2 } from '../../utils/calculations'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'
import { Button } from '../ui/Button'
import { Modal } from '../ui/Modal'

interface LineItemFormProps {
  estimateId: string
  baseRates: readonly BaseRate[]
  editingItem?: LineItem
  onSave: (item: Omit<LineItem, 'id'>) => void
  onClose: () => void
}

export function LineItemForm({ estimateId, baseRates, editingItem, onSave, onClose }: LineItemFormProps) {
  const [description, setDescription] = useState(editingItem?.description ?? '')
  const [category, setCategory] = useState<CostCategory>(editingItem?.category ?? 'time')
  const [quantity, setQuantity] = useState(String(editingItem?.quantity ?? '1'))
  const [unit, setUnit] = useState<RateUnit>(editingItem?.unit ?? 'hour')
  const [costPerUnit, setCostPerUnit] = useState(String(editingItem?.costPerUnit ?? ''))
  const [clientPerUnit, setClientPerUnit] = useState(String(editingItem?.clientPerUnit ?? ''))
  const [selectedBaseRateId, setSelectedBaseRateId] = useState(editingItem?.baseRateId ?? '')
  const [autoUpcharge, setAutoUpcharge] = useState(
    editingItem
      ? editingItem.category === 'materials' && round2(editingItem.clientPerUnit) === round2((editingItem.costPerUnit * MATERIALS_UPCHARGE))
      : true
  )

  const filteredRates = baseRates.filter(r => r.category === category)

  useEffect(() => {
    if (category === 'materials' && autoUpcharge && costPerUnit) {
      const cost = parseFloat(costPerUnit)
      if (!isNaN(cost)) setClientPerUnit(String(applyMaterialsUpcharge(cost)))
    }
  }, [costPerUnit, category, autoUpcharge])

  function handleBaseRateChange(rateId: string) {
    setSelectedBaseRateId(rateId)
    if (!rateId) return
    const rate = baseRates.find(r => r.id === rateId)
    if (!rate) return
    setDescription(rate.name)
    setUnit(rate.unit)
    setCostPerUnit(String(rate.costPerUnit))
    setClientPerUnit(String(rate.clientPerUnit))
  }

  function handleSubmit() {
    const qty = parseFloat(quantity)
    const cost = parseFloat(costPerUnit)
    const client = parseFloat(clientPerUnit)
    if (!description.trim() || isNaN(qty) || isNaN(cost) || isNaN(client) || qty <= 0) return

    onSave({
      estimateId,
      category,
      description: description.trim(),
      quantity: qty,
      unit,
      costPerUnit: cost,
      clientPerUnit: client,
      baseRateId: selectedBaseRateId || undefined,
    })
    onClose()
  }

  const isValid = description.trim() && parseFloat(quantity) > 0 && !isNaN(parseFloat(costPerUnit)) && !isNaN(parseFloat(clientPerUnit))

  return (
    <Modal
      title={editingItem ? 'Edit Line Item' : 'Add Line Item'}
      onClose={onClose}
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={!isValid}>
            {editingItem ? 'Save Changes' : 'Add Item'}
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        <Select
          label="Category"
          value={category}
          onChange={e => { setCategory(e.target.value as CostCategory); setSelectedBaseRateId('') }}
          options={CATEGORIES.map(c => ({ value: c, label: CATEGORY_LABELS[c] }))}
        />

        {filteredRates.length > 0 && (
          <Select
            label="Load from Base Rate (optional)"
            value={selectedBaseRateId}
            onChange={e => handleBaseRateChange(e.target.value)}
            options={[
              { value: '', label: '— manual entry —' },
              ...filteredRates.map(r => ({ value: r.id, label: r.name })),
            ]}
          />
        )}

        <Input
          label="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="What is this line item?"
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Quantity"
            type="number"
            min="0"
            step="any"
            value={quantity}
            onChange={e => setQuantity(e.target.value)}
          />
          <Select
            label="Unit"
            value={unit}
            onChange={e => setUnit(e.target.value as RateUnit)}
            options={UNITS.map(u => ({ value: u, label: UNIT_LABELS[u] }))}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Your Cost / Unit ($)"
            type="number"
            min="0"
            step="0.01"
            value={costPerUnit}
            onChange={e => setCostPerUnit(e.target.value)}
            helpText="What it costs you"
          />
          <div>
            <Input
              label="Client Price / Unit ($)"
              type="number"
              min="0"
              step="0.01"
              value={clientPerUnit}
              onChange={e => { setClientPerUnit(e.target.value); setAutoUpcharge(false) }}
              helpText={category === 'materials' ? `+30% upcharge applied` : 'What client pays'}
            />
            {category === 'materials' && (
              <label className="flex items-center gap-1.5 mt-1.5 text-xs text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoUpcharge}
                  onChange={e => setAutoUpcharge(e.target.checked)}
                  className="rounded"
                />
                Auto-apply 30% upcharge
              </label>
            )}
          </div>
        </div>

        {parseFloat(costPerUnit) > 0 && parseFloat(clientPerUnit) > 0 && (
          <div className="bg-blue-50 rounded-lg p-3 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Your cost:</span>
              <span className="font-medium">${(parseFloat(quantity) * parseFloat(costPerUnit)).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-blue-700 font-medium">
              <span>Client pays:</span>
              <span>${(parseFloat(quantity) * parseFloat(clientPerUnit)).toFixed(2)}</span>
            </div>
          </div>
        )}
      </div>
    </Modal>
  )
}
