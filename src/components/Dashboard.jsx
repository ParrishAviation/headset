import { useState } from 'react'

const VIEW_PREF_KEY = 'headset_view_layout'

const HEADSET_COLOR = {
  'HS-01': { border: '#60a5fa', glow: 'rgba(96,165,250,0.3)', label: 'A' },
  'HS-02': { border: '#f87171', glow: 'rgba(248,113,113,0.3)', label: 'B' },
  'HS-03': { border: '#60a5fa', glow: 'rgba(96,165,250,0.3)', label: 'A' },
  'HS-04': { border: '#f87171', glow: 'rgba(248,113,113,0.3)', label: 'B' },
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

  const formatTime = (d) => new Date(d).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  const formatDate = (d) => new Date(d).toLocaleDateString([], { month: 'short', day: 'numeric' })

  const font = { fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", sans-serif' }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#000000', ...font }}>

      {/* Header */}
      <header className="flex items-center justify-between px-10 pt-9 pb-7">
        <div className="flex items-center gap-4">
          <img src="/logo.png" alt="Logo" className="w-12 h-12 rounded-2xl object-cover" style={{ boxShadow: '0 0 0 1px rgba(255,255,255,0.1), 0 8px 24px rgba(0,0,0,0.6)' }} />
          <div>
            <h1 style={{ color: '#f5f5f7', fontSize: '20px', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.1 }}>
              Headset Rental
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.28)', fontSize: '12px', marginTop: '4px', letterSpacing: '0.01em' }}>
              Lightspeed $10 &nbsp;·&nbsp; David Clark $5
            </p>
          </div>
        </div>
        <button
          onClick={onAdmin}
          style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <svg style={{ width: '16px', height: '16px', color: 'rgba(255,255,255,0.4)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </header>

      {/* Divider */}
      <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', marginLeft: '40px', marginRight: '40px', marginBottom: '28px' }} />

      {/* Tab switcher */}
      <div className="flex px-10 gap-6 mb-8">
        {[
          { key: 'available', label: 'Available', count: available.length },
          { key: 'rented', label: 'Rented Out', count: rented.length },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              paddingBottom: '10px',
              borderBottom: tab === t.key ? '2px solid #f5f5f7' : '2px solid transparent',
              color: tab === t.key ? '#f5f5f7' : 'rgba(255,255,255,0.3)',
              fontSize: '15px',
              fontWeight: 600,
              letterSpacing: '-0.02em',
              background: 'none',
              transition: 'color 0.2s, border-color 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '7px',
            }}
          >
            {t.label}
            <span style={{
              fontSize: '11px',
              fontWeight: 700,
              padding: '2px 7px',
              borderRadius: '20px',
              background: tab === t.key ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.05)',
              color: tab === t.key ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.2)',
            }}>
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {/* Cards grid */}
      <div className="flex-1 px-10 pb-10">

        {tab === 'available' && (
          available.length === 0 ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px' }}>
              <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '14px' }}>All headsets are rented out</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {available.map(headset => {
                const c = HEADSET_COLOR[headset.id] || { border: '#888', glow: 'transparent', label: '' }
                return (
                  <div
                    key={headset.id}
                    style={{
                      background: 'linear-gradient(145deg, #1a1a1a 0%, #141414 100%)',
                      borderRadius: '28px',
                      border: '1px solid rgba(255,255,255,0.07)',
                      overflow: 'hidden',
                      boxShadow: '0 1px 0 rgba(255,255,255,0.05) inset, 0 32px 64px rgba(0,0,0,0.5)',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    {/* Logo box */}
                    <div style={{ margin: '14px 14px 0', position: 'relative' }}>
                      <div style={{
                        height: '172px',
                        borderRadius: '18px',
                        background: '#fafaf9',
                        border: `2px solid ${c.border}`,
                        boxShadow: `0 0 20px ${c.glow}, 0 0 0 1px rgba(255,255,255,0.05)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                      }}>
                        <HeadsetLogo model={headset.model} />
                      </div>
                      {/* Unit badge */}
                      <div style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        width: '26px',
                        height: '26px',
                        borderRadius: '50%',
                        background: c.border,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '11px',
                        fontWeight: 700,
                        color: '#000',
                        letterSpacing: 0,
                      }}>
                        {c.label}
                      </div>
                    </div>

                    {/* Footer */}
                    <div style={{ padding: '16px 16px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4ade80' }} />
                        <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px', fontWeight: 500 }}>Available</span>
                      </div>
                      <button
                        onClick={() => onCheckout(headset.id)}
                        style={{
                          background: '#f5f5f7',
                          color: '#000',
                          fontSize: '13px',
                          fontWeight: 700,
                          padding: '10px 22px',
                          borderRadius: '14px',
                          letterSpacing: '-0.02em',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
                          transition: 'opacity 0.15s, transform 0.1s',
                        }}
                        onMouseDown={e => e.currentTarget.style.transform = 'scale(0.96)'}
                        onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                      >
                        Rent — ${headset.fee.toFixed(2)}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )
        )}

        {tab === 'rented' && (
          activeRentals.length === 0 ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px' }}>
              <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '14px' }}>No headsets currently rented</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {activeRentals.map(rental => {
                const c = HEADSET_COLOR[rental.headsetId] || { border: '#888', glow: 'transparent', label: '' }
                return (
                  <div
                    key={rental.id}
                    style={{
                      background: 'linear-gradient(145deg, #1a1a1a 0%, #141414 100%)',
                      borderRadius: '28px',
                      border: '1px solid rgba(255,255,255,0.07)',
                      overflow: 'hidden',
                      boxShadow: '0 1px 0 rgba(255,255,255,0.05) inset, 0 32px 64px rgba(0,0,0,0.5)',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    {/* Logo box */}
                    <div style={{ margin: '14px 14px 0', position: 'relative' }}>
                      <div style={{
                        height: '172px',
                        borderRadius: '18px',
                        background: '#fafaf9',
                        border: `2px solid ${c.border}`,
                        boxShadow: `0 0 20px ${c.glow}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                      }}>
                        <HeadsetLogo model={rental.headsetModel} />
                      </div>
                      <div style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        width: '26px',
                        height: '26px',
                        borderRadius: '50%',
                        background: c.border,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '11px',
                        fontWeight: 700,
                        color: '#000',
                      }}>
                        {c.label}
                      </div>
                    </div>

                    {/* Renter info */}
                    <div style={{ padding: '14px 18px 0' }}>
                      {[
                        { label: 'Renter', value: rental.renterName },
                        { label: 'Since', value: `${formatDate(rental.checkoutTime)} · ${formatTime(rental.checkoutTime)}` },
                        { label: 'Fee', value: `$${rental.fee.toFixed(2)}` },
                      ].map(({ label, value }) => (
                        <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
                          <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '11px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</span>
                          <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '13px', fontWeight: 600, letterSpacing: '-0.01em' }}>{value}</span>
                        </div>
                      ))}
                    </div>

                    {/* Return button */}
                    <div style={{ padding: '12px 16px 16px' }}>
                      <button
                        onClick={() => onCheckin(rental.id)}
                        style={{
                          width: '100%',
                          padding: '11px',
                          borderRadius: '14px',
                          background: 'rgba(255,255,255,0.06)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          color: 'rgba(255,255,255,0.6)',
                          fontSize: '13px',
                          fontWeight: 600,
                          letterSpacing: '-0.01em',
                          transition: 'background 0.2s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                      >
                        Return Headset
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )
        )}

      </div>
    </div>
  )
}
