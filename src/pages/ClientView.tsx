import { useParams, Link } from 'react-router-dom'
import { useEstimates } from '../hooks/useEstimates'
import { ClientEstimate } from '../components/client-view/ClientEstimate'
import { Button } from '../components/ui/Button'

export function ClientView() {
  const { id } = useParams<{ id: string }>()
  const { estimates } = useEstimates()
  const estimate = estimates.find(e => e.id === id)

  if (!estimate) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500">Estimate not found.</p>
        <Link to="/" className="text-blue-600 text-sm mt-2 inline-block">← Back to estimates</Link>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6 no-print">
        <Link to={`/estimate/${estimate.id}`} className="text-sm text-gray-500 hover:text-gray-700">
          ← Back to Editor
        </Link>
        <Button variant="secondary" size="sm" onClick={() => window.print()}>
          🖨️ Print / Save PDF
        </Button>
      </div>
      <ClientEstimate estimate={estimate} />
    </div>
  )
}
