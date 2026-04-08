import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useEstimates } from '../hooks/useEstimates'
import { EstimateCard } from '../components/estimates/EstimateCard'
import { Button } from '../components/ui/Button'
import { Modal } from '../components/ui/Modal'
import { Input } from '../components/ui/Input'
import { formatCurrency } from '../utils/formatters'
import { computeEstimateTotals } from '../utils/calculations'

export function Dashboard() {
  const { estimates, addEstimate } = useEstimates()
  const navigate = useNavigate()
  const [showNewForm, setShowNewForm] = useState(false)
  const [name, setName] = useState('')
  const [clientName, setClientName] = useState('')
  const [clientEmail, setClientEmail] = useState('')
  const [clientPhone, setClientPhone] = useState('')

  const totalRevenue = estimates.reduce((sum, e) => sum + computeEstimateTotals(e).totalClient, 0)
  const acceptedRevenue = estimates
    .filter(e => e.status === 'accepted')
    .reduce((sum, e) => sum + computeEstimateTotals(e).totalClient, 0)

  function handleCreate() {
    if (!name.trim() || !clientName.trim()) return
    const id = addEstimate({ name: name.trim(), clientName: clientName.trim(), clientEmail: clientEmail.trim() || undefined, clientPhone: clientPhone.trim() || undefined })
    setShowNewForm(false)
    setName('')
    setClientName('')
    setClientEmail('')
    setClientPhone('')
    navigate(`/estimate/${id}`)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Estimates</h1>
          <p className="text-sm text-gray-500 mt-0.5">{estimates.length} total</p>
        </div>
        <Button onClick={() => setShowNewForm(true)}>+ New Estimate</Button>
      </div>

      {estimates.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-blue-50 rounded-xl p-4">
            <p className="text-sm text-blue-600 font-medium">Total Quoted</p>
            <p className="text-xl font-bold text-blue-900">{formatCurrency(totalRevenue)}</p>
          </div>
          <div className="bg-green-50 rounded-xl p-4">
            <p className="text-sm text-green-600 font-medium">Accepted</p>
            <p className="text-xl font-bold text-green-900">{formatCurrency(acceptedRevenue)}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-sm text-gray-600 font-medium">Jobs</p>
            <p className="text-xl font-bold text-gray-900">{estimates.filter(e => e.status === 'accepted').length} / {estimates.length}</p>
          </div>
        </div>
      )}

      {estimates.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">📋</p>
          <p className="text-lg font-medium">No estimates yet</p>
          <p className="text-sm mt-1">Create your first estimate to get started</p>
          <Button className="mt-4" onClick={() => setShowNewForm(true)}>+ New Estimate</Button>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[...estimates].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).map(e => (
            <EstimateCard key={e.id} estimate={e} />
          ))}
        </div>
      )}

      {showNewForm && (
        <Modal
          title="New Estimate"
          onClose={() => setShowNewForm(false)}
          footer={
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setShowNewForm(false)}>Cancel</Button>
              <Button onClick={handleCreate} disabled={!name.trim() || !clientName.trim()}>Create</Button>
            </div>
          }
        >
          <div className="flex flex-col gap-4">
            <Input label="Job Name" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Kitchen Cabinets - 123 Main St" />
            <Input label="Client Name" value={clientName} onChange={e => setClientName(e.target.value)} placeholder="John Smith" />
            <Input label="Client Email (optional)" type="email" value={clientEmail} onChange={e => setClientEmail(e.target.value)} />
            <Input label="Client Phone (optional)" type="tel" value={clientPhone} onChange={e => setClientPhone(e.target.value)} />
          </div>
        </Modal>
      )}
    </div>
  )
}
