import { useState } from 'react'

const VIEW_PREF_KEY = 'headset_view_layout'

const HEADSET_BORDER = {
  'HS-01': '#3b82f6',
  'HS-02': '#ef4444',
  'HS-03': '#3b82f6',
  'HS-04': '#ef4444',
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
    <div className="min-h-screen flex flex-col" style={{ background: '#0a0a0a', fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", sans-serif' }}>

      {/* Header */}
      <header className="px-8 pt-8 pb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img src="/logo.png" alt="Logo" className="w-11 h-11 rounded-2xl object-cover" style={{ boxShadow: '0 0 0 1px rgba(255,255,255,0.08)' }} />
          <div>
            <h1 className="text-xl font-semibold tracking-tight" style={{ color: '#f5f5f7', letterSpacing: '-0.02em' }}>Headset Rental</h1>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>Lightspeed $10 &nbsp;·&nbsp; David Clark $5</p>
          </div>
        </div>
        <button
          onClick={onAdmin}
          className="w-9 h-9 rounded-full flex items-center justify-center transition-all"
          style={{ background: 'rgba(255,255,255,0.07)' }}
          title="Admin"
        >
          <svg style={{ width: '16px', height: '16px', color: 'rgba(255,255,255,0.5)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </header>

      {/* Tab switcher */}
      <div className="px-8 mb-7">
        <div className="flex rounded-2xl p-1 gap-1" style={{ background: 'rgba(255,255,255,0.06)' }}>
          {[
            { key: 'available', label: 'Available', count: available.length },
            { key: 'rented', label: 'Rented Out', count: rented.length },
          ].map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
              style={{
                background: tab === t.key ? 'rgba(255,255,255,0.1)' : 'transparent',
                color: tab === t.key ? '#f5f5f7' : 'rgba(255,255,255,0.35)',
                boxShadow: tab === t.key ? '0 1px 3px rgba(0,0,0,0.4)' : 'none',
                letterSpacing: '-0.01em',
              }}
            >
              {t.label}
              <span className="ml-1.5 text-xs" style={{ color: tab === t.key ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.2)' }}>
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
            <div className="flex items-center justify-center h-64">
              <p className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.25)' }}>All headsets are rented out</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {available.map(headset => (
                <div
                  key={headset.id}
                  className="rounded-3xl flex flex-col overflow-hidden"
                  style={{ background: '#1c1c1e', boxShadow: '0 1px 0 rgba(255,255,255,0.05) inset, 0 20px 40px rgba(0,0,0,0.4)' }}
                >
                  {/* Logo box — white bg so black logos show */}
                  <div
                    className="m-3 rounded-2xl flex items-center justify-center"
                    style={{
                      height: '160px',
                      background: '#ffffff',
                      border: `2px solid ${HEADSET_BORDER[headset.id] || '#555'}`,
                    }}
                  >
                    <HeadsetLogo model={headset.model} />
                  </div>
                  {/* Footer */}
                  <div className="px-4 pb-4 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
                      <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.35)' }}>Available</span>
                    </div>
                    <button
                      onClick={() => onCheckout(headset.id)}
                      className="text-sm font-semibold px-5 py-2.5 rounded-xl transition-all active:scale-95"
                      style={{
                        background: '#f5f5f7',
                        color: '#0a0a0a',
                        letterSpacing: '-0.01em',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                      }}
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
            <div className="flex items-center justify-center h-64">
              <p className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.25)' }}>No headsets currently rented</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {activeRentals.map(rental => (
                <div
                  key={rental.id}
                  className="rounded-3xl flex flex-col overflow-hidden"
                  style={{ background: '#1c1c1e', boxShadow: '0 1px 0 rgba(255,255,255,0.05) inset, 0 20px 40px rgba(0,0,0,0.4)' }}
                >
                  {/* Logo box */}
                  <div
                    className="m-3 rounded-2xl flex items-center justify-center"
                    style={{
                      height: '160px',
                      background: '#ffffff',
                      border: `2px solid ${HEADSET_BORDER[rental.headsetId] || '#555'}`,
                    }}
                  >
                    <HeadsetLogo model={rental.headsetModel} />
                  </div>
                  {/* Info */}
                  <div className="px-4 pb-2 space-y-2">
                    {[
                      { label: 'Renter', value: rental.renterName },
                      { label: 'Since', value: `${formatDate(rental.checkoutTime)} ${formatTime(rental.checkoutTime)}` },
                      { label: 'Fee', value: `$${rental.fee.toFixed(2)}` },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex justify-between items-baseline">
                        <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.3)' }}>{label}</span>
                        <span className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.85)', letterSpacing: '-0.01em' }}>{value}</span>
                      </div>
                    ))}
                  </div>
                  {/* Return button */}
                  <div className="p-4 pt-3">
                    <button
                      onClick={() => onCheckin(rental.id)}
                      className="w-full text-sm font-semibold py-2.5 rounded-xl transition-all active:scale-95"
                      style={{
                        background: 'rgba(255,255,255,0.08)',
                        color: 'rgba(255,255,255,0.7)',
                        letterSpacing: '-0.01em',
                        border: '1px solid rgba(255,255,255,0.07)',
                      }}
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
