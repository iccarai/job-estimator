import { useState } from 'react'
import type { BaseRate, CostCategory, RateUnit } from '../../types'
import { CATEGORIES, CATEGORY_LABELS, UNITS, UNIT_LABELS, MATERIALS_UPCHARGE } from '../../constants'
import { applyMaterialsUpcharge } from '../../utils/calculations'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'
import { Button } from '../ui/Button'
import { Modal } from '../ui/Modal'

interface BaseRateFormProps {
  editingRate?: BaseRate
  onSave: (rate: Omit<BaseRate, 'id'>) => void
  onClose: () => void
}

export function BaseRateForm({ editingRate, onSave, onClose }: BaseRateFormProps) {
  const [name, setName] = useState(editingRate?.name ?? '')
  const [category, setCategory] = useState<CostCategory>(editingRate?.category ?? 'time')
  const [unit, setUnit] = useState<RateUnit>(editingRate?.unit ?? 'hour')
  const [costPerUnit, setCostPerUnit] = useState(String(editingRate?.costPerUnit ?? ''))
  const [clientPerUnit, setClientPerUnit] = useState(String(editingRate?.clientPerUnit ?? ''))
  const [autoUpcharge, setAutoUpcharge] = useState(
    editingRate
      ? editingRate.category === 'materials' && editingRate.clientPerUnit === applyMaterialsUpcharge(editingRate.costPerUnit)
      : true
  )

  function handleCostChange(val: string) {
    setCostPerUnit(val)
    if (category === 'materials' && autoUpcharge) {
      const cost = parseFloat(val)
      if (!isNaN(cost)) setClientPerUnit(String(applyMaterialsUpcharge(cost)))
    }
  }

  function handleCategoryChange(cat: CostCategory) {
    setCategory(cat)
    if (cat === 'materials' && autoUpcharge && costPerUnit) {
      const cost = parseFloat(costPerUnit)
      if (!isNaN(cost)) setClientPerUnit(String(applyMaterialsUpcharge(cost)))
    }
  }

  function handleSubmit() {
    const cost = parseFloat(costPerUnit)
    const client = parseFloat(clientPerUnit)
    if (!name.trim() || isNaN(cost) || isNaN(client)) return
    onSave({ name: name.trim(), category, unit, costPerUnit: cost, clientPerUnit: client })
    onClose()
  }

  const isValid = name.trim() && !isNaN(parseFloat(costPerUnit)) && !isNaN(parseFloat(clientPerUnit))

  return (
    <Modal
      title={editingRate ? 'Edit Base Rate' : 'Add Base Rate'}
      onClose={onClose}
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={!isValid}>
            {editingRate ? 'Save Changes' : 'Add Rate'}
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        <Input
          label="Name"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="e.g. Fuel per km, Saw rental"
        />

        <div className="grid grid-cols-2 gap-3">
          <Select
            label="Category"
            value={category}
            onChange={e => handleCategoryChange(e.target.value as CostCategory)}
            options={CATEGORIES.map(c => ({ value: c, label: CATEGORY_LABELS[c] }))}
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
            onChange={e => handleCostChange(e.target.value)}
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
              helpText={category === 'materials' ? `+${Math.round((MATERIALS_UPCHARGE - 1) * 100)}% upcharge` : 'What client pays'}
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
      </div>
    </Modal>
  )
}
