import { useState } from 'react'

const HEADSET_COLOR = {
  'HS-01': '#3b82f6',
  'HS-02': '#ef4444',
  'HS-03': '#3b82f6',
  'HS-04': '#ef4444',
}

const HEADSET_LABEL = {
  'HS-01': 'Unit A',
  'HS-02': 'Unit B',
  'HS-03': 'Unit A',
  'HS-04': 'Unit B',
}

function HeadsetLogo({ model }) {
  if (model.toLowerCase().includes('lightspeed'))
    return <img src="/lightspeed-logo.png" alt="Lightspeed" style={{ maxWidth: '75%', maxHeight: '75%', objectFit: 'contain' }} />
  if (model.toLowerCase().includes('david clark'))
    return <img src="/davidclark-logo.png" alt="David Clark" style={{ maxWidth: '68%', maxHeight: '68%', objectFit: 'contain' }} />
  return null
}

const F = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", sans-serif'

export default function Dashboard({ headsets, rentals, onCheckout, onCheckin, onAdmin }) {
  const [tab, setTab] = useState('available')

  const available = headsets.filter(h => h.status === 'available')
  const rented = headsets.filter(h => h.status === 'rented')
  const activeRentals = rentals.filter(r => r.status === 'active')

  const fmtDate = (d) => new Date(d).toLocaleDateString([], { month: 'short', day: 'numeric' })
  const fmtTime = (d) => new Date(d).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  const tabs = [
    { key: 'available', label: 'Available', count: available.length },
    { key: 'rented', label: 'Rented Out', count: rented.length },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#000', fontFamily: F, display: 'flex', flexDirection: 'column' }}>

      {/* ── Header ── */}
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 48px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <img src="/logo.png" alt="Logo" style={{ width: '38px', height: '38px', borderRadius: '10px', objectFit: 'cover' }} />
          <span style={{ color: '#fff', fontSize: '17px', fontWeight: 600, letterSpacing: '-0.03em' }}>Headset Rental</span>
        </div>

        {/* Tab nav — center */}
        <div style={{ display: 'flex', gap: '0' }}>
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              padding: '6px 20px',
              color: tab === t.key ? '#fff' : 'rgba(255,255,255,0.38)',
              fontSize: '13px', fontWeight: 600,
              letterSpacing: '0.05em', textTransform: 'uppercase',
              borderBottom: tab === t.key ? '1.5px solid #fff' : '1.5px solid transparent',
              transition: 'color 0.18s, border-color 0.18s',
              fontFamily: F,
            }}>
              {t.label}
              <span style={{ marginLeft: '6px', fontSize: '10px', opacity: 0.45 }}>{t.count}</span>
            </button>
          ))}
        </div>

        <button onClick={onAdmin} style={{
          background: 'none', border: '1px solid rgba(255,255,255,0.18)', borderRadius: '6px',
          color: 'rgba(255,255,255,0.55)', fontSize: '11px', fontWeight: 700,
          letterSpacing: '0.1em', textTransform: 'uppercase', padding: '7px 16px',
          cursor: 'pointer', fontFamily: F, transition: 'border-color 0.2s, color 0.2s',
        }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.45)'; e.currentTarget.style.color = '#fff' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)'; e.currentTarget.style.color = 'rgba(255,255,255,0.55)' }}
        >
          Admin
        </button>
      </header>

      {/* ── Grid ── */}
      <div style={{ flex: 1, padding: '36px 48px 48px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px', alignContent: 'start' }}>

        {/* AVAILABLE */}
        {tab === 'available' && available.map(headset => {
          const color = HEADSET_COLOR[headset.id] || '#888'
          const label = HEADSET_LABEL[headset.id] || ''
          return (
            <div key={headset.id} style={{
              background: '#0d0d0d',
              borderRadius: '16px',
              border: '1px solid rgba(255,255,255,0.05)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 24px 48px rgba(0,0,0,0.6)',
            }}>
              {/* Color stripe — Tesla variant indicator */}
              <div style={{ height: '3px', background: color, width: '100%', opacity: 0.9 }} />

              {/* Logo hero — white canvas, large */}
              <div style={{
                background: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '220px',
                position: 'relative',
              }}>
                <HeadsetLogo model={headset.model} />
                <span style={{
                  position: 'absolute', bottom: '10px', right: '12px',
                  fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em',
                  color: 'rgba(0,0,0,0.25)', textTransform: 'uppercase',
                }}>{label}</span>
              </div>

              {/* Info strip */}
              <div style={{ padding: '16px 20px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ color: 'rgba(255,255,255,0.38)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  Rental fee
                </span>
                <span style={{ color: '#fff', fontSize: '24px', fontWeight: 700, letterSpacing: '-0.04em' }}>
                  ${headset.fee.toFixed(2)}
                </span>
              </div>

              {/* CTA */}
              <div style={{ padding: '0 16px 16px' }}>
                <button
                  onClick={() => onCheckout(headset.id)}
                  style={{
                    width: '100%', padding: '14px',
                    borderRadius: '8px',
                    background: '#fff', color: '#000',
                    fontSize: '13px', fontWeight: 700,
                    letterSpacing: '0.06em', textTransform: 'uppercase',
                    border: 'none', cursor: 'pointer',
                    transition: 'opacity 0.15s, transform 0.1s',
                    fontFamily: F,
                  }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '0.87'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                  onMouseDown={e => e.currentTarget.style.transform = 'scale(0.98)'}
                  onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                  Rent Now
                </button>
              </div>
            </div>
          )
        })}

        {tab === 'available' && available.length === 0 && (
          <div style={{ gridColumn: '1/-1', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px' }}>
            <p style={{ color: 'rgba(255,255,255,0.15)', fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>All headsets are rented out</p>
          </div>
        )}

        {/* RENTED */}
        {tab === 'rented' && activeRentals.map(rental => {
          const color = HEADSET_COLOR[rental.headsetId] || '#888'
          const label = HEADSET_LABEL[rental.headsetId] || ''
          return (
            <div key={rental.id} style={{
              background: '#0d0d0d',
              borderRadius: '16px',
              border: '1px solid rgba(255,255,255,0.05)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 24px 48px rgba(0,0,0,0.6)',
            }}>
              <div style={{ height: '3px', background: color, width: '100%', opacity: 0.9 }} />

              {/* Logo hero */}
              <div style={{
                background: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '180px',
                position: 'relative',
              }}>
                <HeadsetLogo model={rental.headsetModel} />
                <span style={{
                  position: 'absolute', bottom: '10px', right: '12px',
                  fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em',
                  color: 'rgba(0,0,0,0.25)', textTransform: 'uppercase',
                }}>{label}</span>
              </div>

              {/* Renter info */}
              <div style={{ padding: '14px 20px 8px' }}>
                {[
                  ['Renter', rental.renterName],
                  ['Since', `${fmtDate(rental.checkoutTime)} · ${fmtTime(rental.checkoutTime)}`],
                  ['Fee paid', `$${rental.fee.toFixed(2)}`],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '9px' }}>
                    <span style={{ color: 'rgba(255,255,255,0.22)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{k}</span>
                    <span style={{ color: 'rgba(255,255,255,0.82)', fontSize: '13px', fontWeight: 600, letterSpacing: '-0.01em' }}>{v}</span>
                  </div>
                ))}
              </div>

              {/* Return CTA */}
              <div style={{ padding: '0 16px 16px' }}>
                <button
                  onClick={() => onCheckin(rental.id)}
                  style={{
                    width: '100%', padding: '13px',
                    borderRadius: '8px',
                    background: 'transparent',
                    color: 'rgba(255,255,255,0.5)',
                    fontSize: '12px', fontWeight: 700,
                    letterSpacing: '0.08em', textTransform: 'uppercase',
                    border: '1px solid rgba(255,255,255,0.1)',
                    cursor: 'pointer',
                    transition: 'border-color 0.2s, color 0.2s',
                    fontFamily: F,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)'; e.currentTarget.style.color = '#fff' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)' }}
                >
                  Return Headset
                </button>
              </div>
            </div>
          )
        })}

        {tab === 'rented' && activeRentals.length === 0 && (
          <div style={{ gridColumn: '1/-1', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px' }}>
            <p style={{ color: 'rgba(255,255,255,0.15)', fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>No headsets currently rented</p>
          </div>
        )}

      </div>
    </div>
  )
}
