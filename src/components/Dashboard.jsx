import { useState } from 'react'

const HEADSET_COLOR = {
  'HS-01': { border: '#3b82f6', glow: 'rgba(59,130,246,0.25)' },
  'HS-02': { border: '#ef4444', glow: 'rgba(239,68,68,0.25)' },
  'HS-03': { border: '#3b82f6', glow: 'rgba(59,130,246,0.25)' },
  'HS-04': { border: '#ef4444', glow: 'rgba(239,68,68,0.25)' },
}

function HeadsetLogo({ model }) {
  if (model.toLowerCase().includes('lightspeed'))
    return <img src="/lightspeed-logo.png" alt="Lightspeed" className="max-h-full max-w-full object-contain p-5" />
  if (model.toLowerCase().includes('david clark'))
    return <img src="/davidclark-logo.png" alt="David Clark" className="max-h-full max-w-full object-contain p-4" />
  return null
}

const F = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", sans-serif'

export default function Dashboard({ headsets, rentals, onCheckout, onCheckin, onAdmin }) {
  const [tab, setTab] = useState('available')

  const available = headsets.filter(h => h.status === 'available')
  const rented = headsets.filter(h => h.status === 'rented')
  const activeRentals = rentals.filter(r => r.status === 'active')

  const fmt = (d) => new Date(d).toLocaleDateString([], { month: 'short', day: 'numeric' })
    + ' · ' + new Date(d).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  return (
    <div style={{ minHeight: '100vh', background: '#000', fontFamily: F, display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '32px 48px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <img src="/logo.png" alt="Logo" style={{ width: '44px', height: '44px', borderRadius: '14px', objectFit: 'cover' }} />
          <div>
            <div style={{ color: '#fff', fontSize: '22px', fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 1 }}>
              Headset Rental
            </div>
            <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px', marginTop: '5px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Lightspeed $10 &nbsp;·&nbsp; David Clark $5
            </div>
          </div>
        </div>
        <button
          onClick={onAdmin}
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '50px', padding: '8px 18px', color: 'rgba(255,255,255,0.45)', fontSize: '12px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer' }}
        >
          Admin
        </button>
      </header>

      {/* Thin divider */}
      <div style={{ height: '1px', background: 'rgba(255,255,255,0.07)', margin: '0 48px' }} />

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0', padding: '0 48px', marginTop: '2px' }}>
        {[
          { key: 'available', label: 'Available', count: available.length },
          { key: 'rented', label: 'Rented Out', count: rented.length },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              padding: '18px 0',
              marginRight: '32px',
              background: 'none',
              border: 'none',
              borderBottom: tab === t.key ? '1.5px solid #fff' : '1.5px solid transparent',
              color: tab === t.key ? '#fff' : 'rgba(255,255,255,0.28)',
              fontSize: '13px',
              fontWeight: 600,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'color 0.2s, border-color 0.2s',
            }}
          >
            {t.label}
            <span style={{ marginLeft: '8px', fontSize: '10px', color: tab === t.key ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.15)' }}>
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {/* Cards */}
      <div style={{ flex: 1, padding: '28px 48px 48px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', alignContent: 'start' }}>

        {tab === 'available' && available.map(headset => {
          const c = HEADSET_COLOR[headset.id] || { border: '#888', glow: 'transparent' }
          return (
            <div key={headset.id} style={{
              background: '#111',
              borderRadius: '20px',
              border: '1px solid rgba(255,255,255,0.06)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}>
              {/* Logo */}
              <div style={{
                margin: '16px 16px 0',
                height: '200px',
                borderRadius: '12px',
                background: '#fff',
                border: `1.5px solid ${c.border}`,
                boxShadow: `0 0 32px ${c.glow}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
              }}>
                <HeadsetLogo model={headset.model} />
              </div>

              {/* Price line */}
              <div style={{ padding: '14px 20px 4px', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Rental fee</span>
                <span style={{ color: '#fff', fontSize: '22px', fontWeight: 700, letterSpacing: '-0.03em' }}>${headset.fee.toFixed(2)}</span>
              </div>

              {/* CTA */}
              <div style={{ padding: '10px 16px 16px' }}>
                <button
                  onClick={() => onCheckout(headset.id)}
                  style={{
                    width: '100%',
                    padding: '15px',
                    borderRadius: '10px',
                    background: '#fff',
                    color: '#000',
                    fontSize: '14px',
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'opacity 0.15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                >
                  Rent Headset
                </button>
              </div>
            </div>
          )
        })}

        {tab === 'available' && available.length === 0 && (
          <div style={{ gridColumn: '1/-1', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '240px' }}>
            <p style={{ color: 'rgba(255,255,255,0.18)', fontSize: '13px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>All headsets are rented out</p>
          </div>
        )}

        {tab === 'rented' && activeRentals.map(rental => {
          const c = HEADSET_COLOR[rental.headsetId] || { border: '#888', glow: 'transparent' }
          return (
            <div key={rental.id} style={{
              background: '#111',
              borderRadius: '20px',
              border: '1px solid rgba(255,255,255,0.06)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}>
              {/* Logo */}
              <div style={{
                margin: '16px 16px 0',
                height: '200px',
                borderRadius: '12px',
                background: '#fff',
                border: `1.5px solid ${c.border}`,
                boxShadow: `0 0 32px ${c.glow}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
              }}>
                <HeadsetLogo model={rental.headsetModel} />
              </div>

              {/* Info */}
              <div style={{ padding: '14px 20px 0' }}>
                {[
                  ['Renter', rental.renterName],
                  ['Since', fmt(rental.checkoutTime)],
                  ['Fee', `$${rental.fee.toFixed(2)}`],
                ].map(([label, value]) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '10px' }}>
                    <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.09em', textTransform: 'uppercase' }}>{label}</span>
                    <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '13px', fontWeight: 600, letterSpacing: '-0.01em' }}>{value}</span>
                  </div>
                ))}
              </div>

              {/* Return CTA */}
              <div style={{ padding: '4px 16px 16px' }}>
                <button
                  onClick={() => onCheckin(rental.id)}
                  style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: '10px',
                    background: 'transparent',
                    color: 'rgba(255,255,255,0.55)',
                    fontSize: '13px',
                    fontWeight: 700,
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    border: '1px solid rgba(255,255,255,0.12)',
                    cursor: 'pointer',
                    transition: 'border-color 0.2s, color 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; e.currentTarget.style.color = '#fff' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = 'rgba(255,255,255,0.55)' }}
                >
                  Return Headset
                </button>
              </div>
            </div>
          )
        })}

        {tab === 'rented' && activeRentals.length === 0 && (
          <div style={{ gridColumn: '1/-1', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '240px' }}>
            <p style={{ color: 'rgba(255,255,255,0.18)', fontSize: '13px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>No headsets currently rented</p>
          </div>
        )}

      </div>
    </div>
  )
}
