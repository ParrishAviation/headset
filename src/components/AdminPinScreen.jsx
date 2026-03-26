import { useState, useEffect, useRef } from 'react'

const PIN_LENGTH = 4

export default function AdminPinScreen({ pin, onSuccess, onCancel }) {
  const ADMIN_PIN = pin || '1234'
  const [pin, setPin] = useState('')
  const [error, setError] = useState(false)
  const [shake, setShake] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    if (pin.length === PIN_LENGTH) {
      if (pin === ADMIN_PIN) {
        onSuccess()
      } else {
        setShake(true)
        setError(true)
        setTimeout(() => {
          setPin('')
          setShake(false)
          setError(false)
          inputRef.current?.focus()
        }, 600)
      }
    }
  }, [pin])

  const handleKey = (digit) => {
    if (pin.length < PIN_LENGTH) setPin(p => p + digit)
  }

  const handleDelete = () => {
    setPin(p => p.slice(0, -1))
    setError(false)
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center px-8">
      {/* Logo + title */}
      <div className="flex flex-col items-center gap-4 mb-10">
        <img src="/logo.png" alt="Logo" className="w-16 h-16 rounded-2xl object-cover shadow-lg" />
        <div className="text-center">
          <h1 className="text-white text-2xl font-bold">Admin Access</h1>
          <p className="text-slate-400 text-sm mt-1">Enter your 4-digit PIN to continue</p>
        </div>
      </div>

      {/* PIN dots */}
      <div className={`flex gap-5 mb-10 ${shake ? 'animate-shake' : ''}`}>
        {Array.from({ length: PIN_LENGTH }).map((_, i) => (
          <div
            key={i}
            className={`w-5 h-5 rounded-full border-2 transition-all duration-150 ${
              i < pin.length
                ? error ? 'bg-red-500 border-red-500' : 'bg-sky-400 border-sky-400'
                : 'bg-transparent border-slate-500'
            }`}
          />
        ))}
      </div>

      {error && (
        <p className="text-red-400 text-sm mb-6 -mt-4">Incorrect PIN. Try again.</p>
      )}

      {/* Hidden input for physical keyboard */}
      <input
        ref={inputRef}
        type="tel"
        inputMode="numeric"
        maxLength={PIN_LENGTH}
        value={pin}
        onChange={e => {
          const val = e.target.value.replace(/\D/g, '').slice(0, PIN_LENGTH)
          setPin(val)
          setError(false)
        }}
        className="sr-only"
      />

      {/* Number pad */}
      <div className="grid grid-cols-3 gap-4 w-72">
        {[1,2,3,4,5,6,7,8,9].map(n => (
          <button
            key={n}
            onClick={() => handleKey(String(n))}
            className="h-16 rounded-2xl bg-slate-700 hover:bg-slate-600 active:bg-slate-500 text-white text-2xl font-semibold transition-colors select-none"
          >
            {n}
          </button>
        ))}
        {/* Cancel */}
        <button
          onClick={onCancel}
          className="h-16 rounded-2xl bg-transparent text-slate-400 hover:text-white text-sm font-medium transition-colors select-none"
        >
          Cancel
        </button>
        {/* 0 */}
        <button
          onClick={() => handleKey('0')}
          className="h-16 rounded-2xl bg-slate-700 hover:bg-slate-600 active:bg-slate-500 text-white text-2xl font-semibold transition-colors select-none"
        >
          0
        </button>
        {/* Backspace */}
        <button
          onClick={handleDelete}
          className="h-16 rounded-2xl bg-transparent text-slate-400 hover:text-white transition-colors flex items-center justify-center select-none"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z" />
          </svg>
        </button>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-6px); }
          80% { transform: translateX(6px); }
        }
        .animate-shake { animation: shake 0.5s ease-in-out; }
      `}</style>
    </div>
  )
}
