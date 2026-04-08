import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppProvider } from './state/AppContext'
import { AppShell } from './components/layout/AppShell'
import { Dashboard } from './pages/Dashboard'
import { EstimateEditor } from './pages/EstimateEditor'
import { ClientView } from './pages/ClientView'
import { BaseRateManager } from './pages/BaseRateManager'

export default function App() {
  return (
    <BrowserRouter basename="/job-estimator/">
      <AppProvider>
        <Routes>
          <Route path="/estimate/:id/client" element={<ClientView />} />
          <Route
            path="*"
            element={
              <AppShell>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/estimate/:id" element={<EstimateEditor />} />
                  <Route path="/rates" element={<BaseRateManager />} />
                </Routes>
              </AppShell>
            }
          />
        </Routes>
      </AppProvider>
    </BrowserRouter>
  )
}
