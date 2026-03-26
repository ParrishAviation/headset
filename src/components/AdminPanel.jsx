import { useState, useRef, useEffect } from 'react'

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

export default function AdminPanel({ headsets, rentals, transactions, adminPin, onPinChange, onBack }) {
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
          { key: 'settings', label: 'Settings' },
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

        {tab === 'settings' && (
          <SettingsTab adminPin={adminPin} onPinChange={onPinChange} />
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

function SettingsTab({ adminPin, onPinChange }) {
  const PIN_LENGTH = 4
  const [phase, setPhase] = useState('idle') // idle | entering-current | entering-new | entering-confirm
  const [current, setCurrent] = useState('')
  const [newPin, setNewPin] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => { if (phase !== 'idle') inputRef.current?.focus() }, [phase])

  const reset = () => {
    setPhase('idle'); setCurrent(''); setNewPin(''); setConfirm(''); setError(''); setSuccess(false)
  }

  const handleDigit = (digit) => {
    setError('')
    if (phase === 'entering-current') {
      const next = (current + digit).slice(0, PIN_LENGTH)
      setCurrent(next)
      if (next.length === PIN_LENGTH) {
        if (next !== adminPin) { setError('Incorrect current PIN'); setTimeout(() => { setCurrent(''); setError('') }, 600) }
        else setPhase('entering-new')
      }
    } else if (phase === 'entering-new') {
      const next = (newPin + digit).slice(0, PIN_LENGTH)
      setNewPin(next)
      if (next.length === PIN_LENGTH) setPhase('entering-confirm')
    } else if (phase === 'entering-confirm') {
      const next = (confirm + digit).slice(0, PIN_LENGTH)
      setConfirm(next)
      if (next.length === PIN_LENGTH) {
        if (next !== newPin) { setError("PINs don't match. Try again."); setTimeout(() => { setNewPin(''); setConfirm(''); setPhase('entering-new'); setError('') }, 800) }
        else { onPinChange(next); setSuccess(true); setTimeout(reset, 1500) }
      }
    }
  }

  const handleDelete = () => {
    setError('')
    if (phase === 'entering-current') setCurrent(p => p.slice(0, -1))
    else if (phase === 'entering-new') setNewPin(p => p.slice(0, -1))
    else if (phase === 'entering-confirm') setConfirm(p => p.slice(0, -1))
  }

  const activePin = phase === 'entering-current' ? current : phase === 'entering-new' ? newPin : confirm

  const phaseLabel = {
    'entering-current': 'Enter current PIN',
    'entering-new': 'Enter new PIN',
    'entering-confirm': 'Confirm new PIN',
  }

  return (
    <div className="max-w-sm">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
        <div>
          <h2 className="font-bold text-slate-800 text-base">Admin PIN</h2>
          <p className="text-slate-500 text-sm mt-1">Change the 4-digit PIN required to access the admin panel.</p>
        </div>

        {phase === 'idle' && !success && (
          <button
            onClick={() => setPhase('entering-current')}
            className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            Change PIN
          </button>
        )}

        {success && (
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
            <svg className="w-4 h-4 text-emerald-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-emerald-700 text-sm font-semibold">PIN updated successfully</span>
          </div>
        )}

        {phase !== 'idle' && !success && (
          <div className="space-y-4">
            <p className="text-sm font-semibold text-slate-700">{phaseLabel[phase]}</p>

            {/* Dots */}
            <div className="flex justify-center gap-4">
              {Array.from({ length: PIN_LENGTH }).map((_, i) => (
                <div key={i} className={`w-4 h-4 rounded-full border-2 transition-all ${
                  i < activePin.length ? error ? 'bg-red-500 border-red-500' : 'bg-sky-500 border-sky-500' : 'bg-transparent border-slate-300'
                }`} />
              ))}
            </div>

            {error && <p className="text-red-500 text-xs text-center">{error}</p>}

            {/* Hidden input for physical keyboard */}
            <input ref={inputRef} type="tel" inputMode="numeric" className="sr-only"
              onChange={e => { const d = e.target.value.replace(/\D/g, '').slice(-1); if (d) handleDigit(d); e.target.value = '' }} />

            {/* Numpad */}
            <div className="grid grid-cols-3 gap-2">
              {[1,2,3,4,5,6,7,8,9].map(n => (
                <button key={n} onClick={() => handleDigit(String(n))}
                  className="h-12 rounded-xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 text-lg font-semibold transition-colors">
                  {n}
                </button>
              ))}
              <button onClick={reset} className="h-12 rounded-xl text-slate-400 hover:text-slate-600 text-sm transition-colors">Cancel</button>
              <button onClick={() => handleDigit('0')}
                className="h-12 rounded-xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 text-lg font-semibold transition-colors">
                0
              </button>
              <button onClick={handleDelete} className="h-12 rounded-xl text-slate-400 hover:text-slate-600 flex items-center justify-center transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z" />
                </svg>
              </button>
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
