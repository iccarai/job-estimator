import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Estimates', icon: '📋' },
  { to: '/rates', label: 'Base Rates', icon: '⚙️' },
]

export function Nav() {
  return (
    <nav className="bg-gray-900 text-white w-full md:w-56 md:min-h-screen flex-shrink-0 no-print">
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-lg font-bold">Job Estimator</h1>
        <p className="text-xs text-gray-400 mt-0.5">Contractor Tools</p>
      </div>
      <ul className="p-2 flex flex-row md:flex-col gap-1">
        {links.map(link => (
          <li key={link.to}>
            <NavLink
              to={link.to}
              end
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`
              }
            >
              <span>{link.icon}</span>
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
