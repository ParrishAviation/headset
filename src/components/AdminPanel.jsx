import { useState } from 'react'

function HeadsetIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M3 12a9 9 0 1 1 18 0M3 12v2a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H4.5M21 12v2a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2H19.5" />
    </svg>
  )
}

const conditionColors = {
  Excellent: 'bg-emerald-100 text-emerald-700',
  Good: 'bg-blue-100 text-blue-700',
  Fair: 'bg-yellow-100 text-yellow-700',
  Poor: 'bg-red-100 text-red-700',
  Damaged: 'bg-red-100 text-red-700',
}

export default function AdminPanel({ headsets, rentals, transactions, onBack }) {
  const [tab, setTab] = useState('overview')

  const activeRentals = rentals.filter(r => r.status === 'active')
  const completedRentals = rentals.filter(r => r.status === 'returned')
  const totalRevenue = transactions.reduce((sum, t) => sum + t.amount, 0)

  const formatDateTime = (date) => {
    return new Date(date).toLocaleString([], {
      month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    })
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <header className="bg-sky-900 text-white px-8 py-5 flex items-center gap-4 shadow-lg">
        <button onClick={onBack} className="p-2 rounded-lg hover:bg-sky-800 transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <img src="/logo.png" alt="Logo" className="w-9 h-9 rounded-lg object-cover" />
        <div>
          <h1 className="text-xl font-bold">Admin Panel</h1>
          <p className="text-sky-300 text-sm">Rental management & reports</p>
        </div>
      </header>

      {/* Tab Nav */}
      <div className="bg-white border-b border-slate-200 px-8">
        <div className="flex gap-1">
          {[
            { key: 'overview', label: 'Overview' },
            { key: 'rentals', label: `All Rentals (${rentals.length})` },
            { key: 'headsets', label: 'Headsets' },
          ].map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-6 py-4 text-sm font-semibold border-b-2 transition-colors ${
                tab === t.key
                  ? 'border-sky-600 text-sky-700'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 p-8">
        {tab === 'overview' && (
          <div className="space-y-6 max-w-3xl">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <StatCard
                label="Total Revenue"
                value={`$${totalRevenue.toFixed(2)}`}
                sub={`${transactions.length} transaction${transactions.length !== 1 ? 's' : ''}`}
                color="emerald"
                icon="💰"
              />
              <StatCard
                label="Active Rentals"
                value={activeRentals.length}
                sub="currently out"
                color="amber"
                icon="🔑"
              />
              <StatCard
                label="Completed Returns"
                value={completedRentals.length}
                sub="all time"
                color="sky"
                icon="✅"
              />
              <StatCard
                label="Headsets Available"
                value={headsets.filter(h => h.status === 'available').length}
                sub={`of ${headsets.length} total`}
                color="violet"
                icon="🎧"
              />
            </div>

            {/* Active rentals quick view */}
            {activeRentals.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <h2 className="font-bold text-slate-800 text-base mb-4">Currently Out</h2>
                <div className="space-y-3">
                  {activeRentals.map(r => (
                    <div key={r.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                      <div>
                        <span className="font-semibold text-slate-800 text-sm">{r.renterName}</span>
                        <span className="text-slate-500 text-sm ml-2">— {r.headsetName}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-slate-500">{formatDateTime(r.checkoutTime)}</div>
                        <div className="text-sm font-semibold text-sky-700">${r.fee.toFixed(2)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {tab === 'rentals' && (
          <div className="max-w-3xl">
            {rentals.length === 0 ? (
              <div className="text-center py-20 text-slate-400">
                <p className="text-xl font-medium">No rental history yet</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="text-left px-5 py-3.5 font-semibold text-slate-600">Renter</th>
                      <th className="text-left px-5 py-3.5 font-semibold text-slate-600">Headset</th>
                      <th className="text-left px-5 py-3.5 font-semibold text-slate-600">Checked Out</th>
                      <th className="text-left px-5 py-3.5 font-semibold text-slate-600">Returned</th>
                      <th className="text-right px-5 py-3.5 font-semibold text-slate-600">Fee</th>
                      <th className="text-center px-5 py-3.5 font-semibold text-slate-600">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...rentals].reverse().map(r => (
                      <tr key={r.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="px-5 py-3.5">
                          <div className="font-semibold text-slate-800">{r.renterName}</div>
                          {r.studentId && <div className="text-slate-400 text-xs">{r.studentId}</div>}
                        </td>
                        <td className="px-5 py-3.5 text-slate-600">{r.headsetName}</td>
                        <td className="px-5 py-3.5 text-slate-600">{formatDateTime(r.checkoutTime)}</td>
                        <td className="px-5 py-3.5 text-slate-600">
                          {r.checkinTime ? formatDateTime(r.checkinTime) : '—'}
                        </td>
                        <td className="px-5 py-3.5 text-right font-semibold text-slate-800">
                          ${r.fee.toFixed(2)}
                        </td>
                        <td className="px-5 py-3.5 text-center">
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                            r.status === 'active'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-emerald-100 text-emerald-700'
                          }`}>
                            {r.status === 'active' ? 'Out' : 'Returned'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {tab === 'headsets' && (
          <div className="max-w-3xl">
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="text-left px-5 py-3.5 font-semibold text-slate-600">Headset</th>
                    <th className="text-left px-5 py-3.5 font-semibold text-slate-600">Model</th>
                    <th className="text-center px-5 py-3.5 font-semibold text-slate-600">Condition</th>
                    <th className="text-center px-5 py-3.5 font-semibold text-slate-600">Status</th>
                    <th className="text-left px-5 py-3.5 font-semibold text-slate-600">Rented To</th>
                  </tr>
                </thead>
                <tbody>
                  {headsets.map(h => (
                    <tr key={h.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <HeadsetIcon className="w-5 h-5 text-slate-400" />
                          <span className="font-semibold text-slate-800">{h.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-slate-600">{h.model}</td>
                      <td className="px-5 py-3.5 text-center">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${conditionColors[h.condition]}`}>
                          {h.condition}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                          h.status === 'available'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}>
                          {h.status === 'available' ? 'Available' : 'Rented Out'}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-slate-600">{h.rentedTo || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({ label, value, sub, color, icon }) {
  const colors = {
    emerald: 'bg-emerald-50 border-emerald-200',
    amber: 'bg-amber-50 border-amber-200',
    sky: 'bg-sky-50 border-sky-200',
    violet: 'bg-violet-50 border-violet-200',
  }
  const textColors = {
    emerald: 'text-emerald-700',
    amber: 'text-amber-700',
    sky: 'text-sky-700',
    violet: 'text-violet-700',
  }

  return (
    <div className={`rounded-2xl border p-5 ${colors[color]}`}>
      <div className="text-2xl mb-1">{icon}</div>
      <div className={`text-3xl font-bold ${textColors[color]}`}>{value}</div>
      <div className="text-slate-700 font-semibold text-sm mt-1">{label}</div>
      <div className="text-slate-500 text-xs mt-0.5">{sub}</div>
    </div>
  )
}
