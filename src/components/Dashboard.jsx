import { useState } from 'react'

const VIEW_PREF_KEY = 'headset_view_layout'

const HEADSET_BORDER = {
  'HS-01': 'border-blue-400',
  'HS-02': 'border-red-400',
  'HS-03': 'border-blue-400',
  'HS-04': 'border-red-400',
}

const HEADSET_ACCENT_BG = {
  'HS-01': 'bg-blue-500',
  'HS-02': 'bg-red-500',
  'HS-03': 'bg-blue-500',
  'HS-04': 'bg-red-500',
}

function HeadsetLogo({ model }) {
  if (model.toLowerCase().includes('lightspeed'))
    return <img src="/lightspeed-logo.png" alt="Lightspeed" className="max-h-full max-w-full object-contain p-5" />
  if (model.toLowerCase().includes('david clark'))
    return <img src="/davidclark-logo.png" alt="David Clark" className="max-h-full max-w-full object-contain p-4" />
  return null
}

export default function Dashboard({ headsets, rentals, onCheckout, onCheckin, onAdmin }) {
  const [tab, setTab] = useState('available')

  const available = headsets.filter(h => h.status === 'available')
  const rented = headsets.filter(h => h.status === 'rented')
  const activeRentals = rentals.filter(r => r.status === 'active')

  const formatTime = (date) => new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  const formatDate = (date) => new Date(date).toLocaleDateString([], { month: 'short', day: 'numeric' })

  return (
    <div className="min-h-screen bg-white flex flex-col">

      {/* Header */}
      <header className="px-8 pt-7 pb-5 flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <img src="/logo.png" alt="Logo" className="w-11 h-11 rounded-xl object-cover shadow-sm" />
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight leading-none">Headset Rental</h1>
            <p className="text-slate-400 text-xs mt-1">Lightspeed $10 &nbsp;·&nbsp; David Clark $5</p>
          </div>
        </div>
        <button
          onClick={onAdmin}
          className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
          title="Admin"
        >
          <svg className="w-4.5 h-4.5 text-slate-500" style={{width:'18px',height:'18px'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </header>

      {/* Tab switcher */}
      <div className="px-8 mb-6">
        <div className="flex bg-slate-100 rounded-2xl p-1 gap-1">
          {[
            { key: 'available', label: 'Available', count: available.length },
            { key: 'rented', label: 'Rented Out', count: rented.length },
          ].map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                tab === t.key
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {t.label}
              <span className={`ml-1.5 text-xs font-bold px-1.5 py-0.5 rounded-full ${
                tab === t.key ? 'bg-slate-100 text-slate-600' : 'text-slate-400'
              }`}>
                {t.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Cards */}
      <div className="flex-1 px-8 pb-8">

        {tab === 'available' && (
          available.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-slate-300">
              <p className="text-base font-medium text-slate-400">All headsets are rented out</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-5">
              {available.map(headset => (
                <div key={headset.id} className="rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                  {/* Logo area */}
                  <div className={`border-2 ${HEADSET_BORDER[headset.id]} rounded-3xl m-3 flex items-center justify-center`} style={{ height: '160px' }}>
                    <HeadsetLogo model={headset.model} />
                  </div>
                  {/* Footer */}
                  <div className="px-4 pb-4 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>
                      <span className="text-xs text-slate-400 font-medium">Available</span>
                    </div>
                    <button
                      onClick={() => onCheckout(headset.id)}
                      className="bg-slate-900 hover:bg-slate-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
                    >
                      Rent — ${headset.fee.toFixed(2)}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {tab === 'rented' && (
          activeRentals.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64">
              <p className="text-base font-medium text-slate-400">No headsets currently rented</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-5">
              {activeRentals.map(rental => (
                <div key={rental.id} className="rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                  {/* Logo area */}
                  <div className={`border-2 ${HEADSET_BORDER[rental.headsetId]} rounded-3xl m-3 flex items-center justify-center`} style={{ height: '160px' }}>
                    <HeadsetLogo model={rental.headsetModel} />
                  </div>
                  {/* Renter info */}
                  <div className="px-4 pb-1 space-y-1.5">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Renter</span>
                      <span className="font-semibold text-slate-800">{rental.renterName}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Since</span>
                      <span className="text-slate-600">{formatDate(rental.checkoutTime)} {formatTime(rental.checkoutTime)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Fee</span>
                      <span className="font-semibold text-slate-800">${rental.fee.toFixed(2)}</span>
                    </div>
                  </div>
                  {/* Return button */}
                  <div className="p-4">
                    <button
                      onClick={() => onCheckin(rental.id)}
                      className="w-full border border-slate-200 hover:bg-slate-50 text-slate-600 text-sm font-semibold py-2.5 rounded-xl transition-colors"
                    >
                      Return
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

      </div>
    </div>
  )
}
