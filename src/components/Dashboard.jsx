import { useState } from 'react'

const VIEW_PREF_KEY = 'headset_view_layout'

function HeadsetIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M3 12a9 9 0 1 1 18 0M3 12v2a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H4.5M21 12v2a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2H19.5" />
    </svg>
  )
}

const HEADSET_BORDER = {
  'HS-01': 'border-blue-300',
  'HS-02': 'border-red-300',
  'HS-03': 'border-blue-300',
  'HS-04': 'border-red-300',
}

const HEADSET_ACCENT = {
  'HS-01': 'bg-blue-500',
  'HS-02': 'bg-red-500',
  'HS-03': 'bg-blue-500',
  'HS-04': 'bg-red-500',
}

function HeadsetLogo({ model }) {
  if (model.toLowerCase().includes('lightspeed')) {
    return <img src="/lightspeed-logo.png" alt="Lightspeed" className="max-h-full max-w-full object-contain" />
  }
  if (model.toLowerCase().includes('david clark')) {
    return <img src="/davidclark-logo.png" alt="David Clark" className="max-h-full max-w-full object-contain p-4" />
  }
  return <HeadsetIcon className="w-12 h-12 text-slate-400" />
}

export default function Dashboard({ headsets, rentals, onCheckout, onCheckin, onAdmin }) {
  const [tab, setTab] = useState('available')
  const [layout, setLayout] = useState(() => localStorage.getItem(VIEW_PREF_KEY) || 'grid')

  const toggleLayout = () => {
    const next = layout === 'grid' ? 'list' : 'grid'
    setLayout(next)
    localStorage.setItem(VIEW_PREF_KEY, next)
  }

  const available = headsets.filter(h => h.status === 'available')
  const rented = headsets.filter(h => h.status === 'rented')
  const activeRentals = rentals.filter(r => r.status === 'active')

  const formatTime = (date) => new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  const formatDate = (date) => new Date(date).toLocaleDateString([], { month: 'short', day: 'numeric' })

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#f0f4f8' }}>

      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Logo" className="w-10 h-10 rounded-xl object-cover" />
          <div>
            <h1 className="text-lg font-bold text-slate-900 leading-tight">Headset Rental</h1>
            <p className="text-slate-400 text-xs">Lightspeed $10 · David Clark $5</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Stats pills */}
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-xs font-semibold px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
              {available.length} available
            </span>
            <span className="flex items-center gap-1.5 bg-amber-50 text-amber-700 text-xs font-semibold px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block"></span>
              {rented.length} out
            </span>
          </div>
          <button
            onClick={onAdmin}
            className="text-slate-400 hover:text-slate-600 p-2 rounded-lg hover:bg-slate-100 transition-colors"
            title="Admin"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </header>

      {/* Tab Nav */}
      <div className="bg-white border-b border-slate-200 px-8 flex items-center justify-between">
        <div className="flex gap-0">
          {[
            { key: 'available', label: `Available (${available.length})` },
            { key: 'rented', label: `Rented Out (${rented.length})` },
          ].map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-5 py-3.5 text-sm font-semibold border-b-2 transition-colors ${
                tab === t.key
                  ? 'border-slate-800 text-slate-900'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1">
          {[
            { key: 'grid', icon: <><rect x="3" y="3" width="8" height="8" rx="1.5" strokeLinejoin="round"/><rect x="13" y="3" width="8" height="8" rx="1.5" strokeLinejoin="round"/><rect x="3" y="13" width="8" height="8" rx="1.5" strokeLinejoin="round"/><rect x="13" y="13" width="8" height="8" rx="1.5" strokeLinejoin="round"/></> },
            { key: 'list', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/> },
          ].map(({ key, icon }) => (
            <button
              key={key}
              onClick={() => { setLayout(key); localStorage.setItem(VIEW_PREF_KEY, key) }}
              className={`p-1.5 rounded-lg transition-colors ${layout === key ? 'bg-slate-100 text-slate-800' : 'text-slate-300 hover:text-slate-500'}`}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">{icon}</svg>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6">

        {/* Available tab */}
        {tab === 'available' && (
          available.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 text-slate-300">
              <HeadsetIcon className="w-14 h-14 mb-3" />
              <p className="text-base font-medium text-slate-400">No headsets available</p>
            </div>
          ) : (
            <div className={layout === 'grid' ? 'grid grid-cols-2 gap-5' : 'flex flex-col gap-4'}>
              {available.map(headset => (
                <div key={headset.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  {/* Color accent bar */}
                  <div className={`h-1 w-full ${HEADSET_ACCENT[headset.id] || 'bg-slate-300'}`} />
                  <div className="p-6 flex flex-col gap-5">
                    {/* Logo box */}
                    <div className={`h-36 rounded-xl border-2 ${HEADSET_BORDER[headset.id] || 'border-slate-200'} flex items-center justify-center px-6`}>
                      <HeadsetLogo model={headset.model} />
                    </div>
                    {/* Footer row */}
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        Available
                      </span>
                      <button
                        onClick={() => onCheckout(headset.id)}
                        className="bg-slate-900 hover:bg-slate-700 active:bg-black text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
                      >
                        Rent — ${headset.fee.toFixed(2)}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {/* Rented tab */}
        {tab === 'rented' && (
          activeRentals.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 text-slate-300">
              <HeadsetIcon className="w-14 h-14 mb-3" />
              <p className="text-base font-medium text-slate-400">No active rentals</p>
            </div>
          ) : (
            <div className={layout === 'grid' ? 'grid grid-cols-2 gap-5' : 'flex flex-col gap-4'}>
              {activeRentals.map(rental => (
                <div key={rental.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                  <div className={`h-1 w-full ${HEADSET_ACCENT[rental.headsetId] || 'bg-slate-300'}`} />
                  <div className="p-6 flex flex-col gap-5">
                    {/* Logo box */}
                    <div className={`h-36 rounded-xl border-2 ${HEADSET_BORDER[rental.headsetId] || 'border-slate-200'} flex items-center justify-center px-6`}>
                      <HeadsetLogo model={rental.headsetModel} />
                    </div>
                    {/* Renter info */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-baseline">
                        <span className="text-xs text-slate-400 font-medium uppercase tracking-wide">Renter</span>
                        <span className="text-sm font-semibold text-slate-800">{rental.renterName}</span>
                      </div>
                      <div className="flex justify-between items-baseline">
                        <span className="text-xs text-slate-400 font-medium uppercase tracking-wide">Since</span>
                        <span className="text-sm text-slate-600">{formatDate(rental.checkoutTime)} at {formatTime(rental.checkoutTime)}</span>
                      </div>
                      <div className="flex justify-between items-baseline">
                        <span className="text-xs text-slate-400 font-medium uppercase tracking-wide">Fee</span>
                        <span className="text-sm font-semibold text-slate-800">${rental.fee.toFixed(2)}</span>
                      </div>
                    </div>
                    {/* Return button */}
                    <button
                      onClick={() => onCheckin(rental.id)}
                      className="w-full border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-semibold py-2.5 rounded-xl transition-colors"
                    >
                      Return Headset
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
