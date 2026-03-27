import { useState, useEffect, useRef } from 'react'
import { QRCodeSVG } from 'qrcode.react'

function HeadsetIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M3 12a9 9 0 1 1 18 0M3 12v2a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H4.5M21 12v2a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2H19.5" />
    </svg>
  )
}

const STEPS = ['Details', 'Payment', 'Agreement', 'Confirm']
const PIN_LENGTH = 4

export default function CheckoutFlow({ headset, onConfirm, onCancel, adminPin }) {
  const [step, setStep] = useState(0)
  const [detailsSubStep, setDetailsSubStep] = useState(0) // 0=firstName, 1=lastName, 2=email
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '' })
  const [paymentMethod, setPaymentMethod] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [errors, setErrors] = useState({})

  // Cash auth state
  const [showCashAuth, setShowCashAuth] = useState(false)
  const [cashPassword, setCashPassword] = useState('')
  const [cashAuthorized, setCashAuthorized] = useState(false)
  const [cashPasswordError, setCashPasswordError] = useState('')

  // Apple Wallet / Square state
  const [squarePayConfirmed, setApplePayConfirmed] = useState(false)
  const [squarePayUrl, setApplePayUrl] = useState(null)
  const [squarePayOrderId, setApplePayOrderId] = useState(null)
  const [squarePayLinkId, setApplePayLinkId] = useState(null)
  const [squarePayLoading, setApplePayLoading] = useState(false)
  const [squarePayError, setApplePayError] = useState(null)
  const pollRef = useRef(null)

  const usesSquare = paymentMethod === 'apple_wallet' || paymentMethod === 'credit_card'

  // Create Square payment link when a card/Apple Wallet method is selected
  useEffect(() => {
    if (!usesSquare || squarePayUrl) return

    setApplePayLoading(true)
    setApplePayError(null)

    fetch('/api/square/payment-link', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: headset.fee,
        label: `Headset Rental — ${headset.name}`,
        headsetId: headset.id,
      }),
    })
      .then(r => r.json())
      .then(data => {
        if (data.error) throw new Error(data.error)
        setApplePayUrl(data.checkoutUrl)
        setApplePayOrderId(data.orderId)
        setApplePayLinkId(data.linkId)
        setApplePayLoading(false)
      })
      .catch(err => {
        setApplePayError(err.message)
        setApplePayLoading(false)
      })
  }, [paymentMethod, usesSquare])

  // Poll for payment completion once we have a linkId
  useEffect(() => {
    if (!squarePayLinkId || squarePayConfirmed) return

    pollRef.current = setInterval(async () => {
      try {
        const r = await fetch(`/api/square/payment-status/${squarePayLinkId}`)
        const data = await r.json()
        if (data.paid) {
          setApplePayConfirmed(true)
          clearInterval(pollRef.current)
        }
      } catch {
        // network blip — keep polling
      }
    }, 3000)

    return () => clearInterval(pollRef.current)
  }, [squarePayLinkId, squarePayConfirmed])

  const validateDetails = () => {
    const e = {}
    if (detailsSubStep === 0) {
      if (!form.firstName.trim()) e.firstName = 'First name is required'
    } else if (detailsSubStep === 1) {
      if (!form.lastName.trim()) e.lastName = 'Last name is required'
    } else {
      if (!form.email.trim()) e.email = 'Email is required'
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Please enter a valid email address'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const validatePayment = () => {
    const e = {}
    if (!paymentMethod) e.paymentMethod = 'Please select a payment method'
    else if (paymentMethod === 'cash' && !cashAuthorized) e.paymentMethod = 'Cash payment must be authorized by staff'
    else if (usesSquare && !squarePayConfirmed) e.paymentMethod = 'Payment must be completed before continuing'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleNext = () => {
    if (step === 0) {
      if (!validateDetails()) return
      if (detailsSubStep < 2) {
        setErrors({})
        setDetailsSubStep(s => s + 1)
        return
      }
    }
    if (step === 1 && !validatePayment()) return
    setErrors({})
    setStep(s => s + 1)
  }

  const handleConfirm = () => {
    if (!agreed) return
    onConfirm({ ...form, renterName: `${form.firstName} ${form.lastName}`, paymentMethod })
  }

  const handleSelectPayment = (value) => {
    setPaymentMethod(value)
    setCashAuthorized(false)
    setCashPassword('')
    setCashPasswordError('')
    setShowCashAuth(value === 'cash')
    setApplePayConfirmed(false)
    setApplePayUrl(null)
    setApplePayOrderId(null)
    setApplePayLinkId(null)
    setApplePayLoading(false)
    setApplePayError(null)
    clearInterval(pollRef.current)
  }

  const handleCashAuth = (enteredPin) => {
    const pin = enteredPin ?? cashPassword
    if (pin === (adminPin || '1234')) {
      setCashAuthorized(true)
      setCashPasswordError('')
      setShowCashAuth(false)
      setCashPassword('')
    } else {
      setCashPasswordError('Incorrect PIN. Try again.')
      setCashPassword('')
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Header */}
      <header className="bg-sky-900 text-white px-8 py-5 flex items-center gap-4 shadow-lg">
        <button onClick={onCancel} className="p-2 rounded-lg hover:bg-sky-800 transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <img src="/logo.png" alt="Logo" className="w-9 h-9 rounded-lg object-cover" />
        <div>
          <h1 className="text-xl font-bold">Rent a Headset</h1>
          <p className="text-sky-300 text-sm">Complete all steps to check out</p>
        </div>
      </header>

      {/* Step Indicator */}
      <div className="bg-white border-b border-slate-200 px-8 py-4">
        <div className="flex items-center gap-2 max-w-lg">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                  i < step ? 'bg-emerald-500 text-white' :
                  i === step ? 'bg-sky-600 text-white' :
                  'bg-slate-200 text-slate-500'
                }`}>
                  {i < step ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : i + 1}
                </div>
                <span className={`text-sm font-medium ${i === step ? 'text-sky-700' : i < step ? 'text-emerald-600' : 'text-slate-400'}`}>
                  {s}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 ${i < step ? 'bg-emerald-400' : 'bg-slate-200'}`}></div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-start px-8 py-8">
        <div className="w-full max-w-lg">

          {/* Headset Info Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-6 flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-sky-50 flex items-center justify-center flex-shrink-0">
              <HeadsetIcon className="w-8 h-8 text-sky-600" />
            </div>
            <div className="flex-1">
              <div className="font-bold text-slate-800 text-lg">{headset.name}</div>
              <div className="text-slate-500">{headset.model}</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-sky-700">${headset.fee.toFixed(2)}</div>
              <div className="text-slate-500 text-sm">rental fee</div>
            </div>
          </div>

          {/* Step 0: Renter Details */}
          {step === 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-800">Renter Information</h2>
                <span className="text-sm text-slate-400">{detailsSubStep + 1} of 3</span>
              </div>

              {/* Breadcrumb trail of completed fields */}
              {detailsSubStep > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => { setDetailsSubStep(0); setErrors({}) }}
                    className="flex items-center gap-1 text-sm text-sky-600 hover:text-sky-800 transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    {form.firstName}
                  </button>
                  {detailsSubStep > 1 && (
                    <>
                      <span className="text-slate-300">·</span>
                      <button
                        onClick={() => { setDetailsSubStep(1); setErrors({}) }}
                        className="text-sm text-sky-600 hover:text-sky-800 transition-colors"
                      >
                        {form.lastName}
                      </button>
                    </>
                  )}
                </div>
              )}

              {detailsSubStep === 0 && (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.firstName}
                    onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))}
                    onKeyDown={e => e.key === 'Enter' && handleNext()}
                    placeholder="e.g. John"
                    autoFocus
                    className={`w-full border rounded-xl px-4 py-3 text-slate-800 text-base focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                      errors.firstName ? 'border-red-400 bg-red-50' : 'border-slate-300'
                    }`}
                  />
                  {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                </div>
              )}

              {detailsSubStep === 1 && (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.lastName}
                    onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))}
                    onKeyDown={e => e.key === 'Enter' && handleNext()}
                    placeholder="e.g. Smith"
                    autoFocus
                    className={`w-full border rounded-xl px-4 py-3 text-slate-800 text-base focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                      errors.lastName ? 'border-red-400 bg-red-50' : 'border-slate-300'
                    }`}
                  />
                  {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                </div>
              )}

              {detailsSubStep === 2 && (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    onKeyDown={e => e.key === 'Enter' && handleNext()}
                    placeholder="e.g. john@example.com"
                    autoFocus
                    className={`w-full border rounded-xl px-4 py-3 text-slate-800 text-base focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                      errors.email ? 'border-red-400 bg-red-50' : 'border-slate-300'
                    }`}
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>
              )}
            </div>
          )}

          {/* Step 1: Payment */}
          {step === 1 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
              <h2 className="text-lg font-bold text-slate-800">Payment</h2>
              <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 flex items-center justify-between">
                <span className="text-sky-700 font-medium">Total Due</span>
                <span className="text-2xl font-bold text-sky-700">${headset.fee.toFixed(2)}</span>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Select Payment Method <span className="text-red-500">*</span>
                </label>
                <div className="space-y-3">
                  {[
                    { value: 'cash', label: 'Cash', icon: '💵' },
                    { value: 'apple_wallet', label: 'Apple Wallet', icon: null },
                  ].map(opt => {
                    const isSelected = paymentMethod === opt.value
                    const isPending = isSelected && (
                      (opt.value === 'cash' && !cashAuthorized) ||
                      (usesSquare && opt.value !== 'cash' && !squarePayConfirmed)
                    )
                    const isDone = isSelected && (
                      (opt.value === 'cash' && cashAuthorized) ||
                      (usesSquare && opt.value !== 'cash' && squarePayConfirmed)
                    )
                    return (
                    <div key={opt.value}>
                      <button
                        onClick={() => handleSelectPayment(opt.value)}
                        className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl border-2 transition-all text-left ${
                          isSelected
                            ? isPending ? 'border-slate-400 bg-slate-50'
                            : isDone ? 'border-emerald-500 bg-emerald-50'
                            : 'border-sky-500 bg-sky-50'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        {opt.icon ? (
                          <span className="text-2xl">{opt.icon}</span>
                        ) : (
                          <svg viewBox="0 0 24 24" className="w-7 h-7 flex-shrink-0" fill="currentColor">
                            <path className={isDone ? 'text-emerald-700' : 'text-slate-700'} d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                          </svg>
                        )}
                        <span className={`font-semibold text-base ${
                          isDone ? 'text-emerald-700' : isPending ? 'text-slate-600' : isSelected ? 'text-sky-700' : 'text-slate-700'
                        }`}>
                          {opt.label}
                        </span>
                        {isPending && opt.value === 'cash' && (
                          <span className="ml-auto text-xs font-bold bg-amber-200 text-amber-800 px-2 py-0.5 rounded-full">Needs Staff Auth</span>
                        )}
                        {isPending && opt.value !== 'cash' && (
                          <span className="ml-auto text-xs font-bold bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full">Scan to Pay</span>
                        )}
                        {isDone && (
                          <div className="ml-auto w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                      </button>

                      {/* Cash PIN prompt */}
                      {opt.value === 'cash' && paymentMethod === 'cash' && showCashAuth && (
                        <div className="mt-2 bg-amber-50 border border-amber-300 rounded-xl p-4 space-y-3">
                          <div className="flex items-center gap-2 text-amber-800">
                            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                            </svg>
                            <p className="font-semibold text-sm">Enter staff PIN to authorize cash payment</p>
                          </div>

                          {/* PIN dots */}
                          <div className="flex justify-center gap-4 py-1">
                            {Array.from({ length: PIN_LENGTH }).map((_, i) => (
                              <div key={i} className={`w-4 h-4 rounded-full border-2 transition-all ${
                                i < cashPassword.length
                                  ? cashPasswordError ? 'bg-red-500 border-red-500' : 'bg-amber-600 border-amber-600'
                                  : 'bg-transparent border-amber-400'
                              }`} />
                            ))}
                          </div>
                          {cashPasswordError && (
                            <p className="text-red-600 text-xs text-center font-medium">{cashPasswordError}</p>
                          )}

                          {/* Numpad */}
                          <div className="grid grid-cols-3 gap-2">
                            {[1,2,3,4,5,6,7,8,9].map(n => (
                              <button
                                key={n}
                                onClick={() => {
                                  if (cashPassword.length < PIN_LENGTH) {
                                    const next = cashPassword + String(n)
                                    setCashPassword(next)
                                    setCashPasswordError('')
                                    if (next.length === PIN_LENGTH) handleCashAuth(next)
                                  }
                                }}
                                className="h-11 rounded-xl bg-white border border-amber-200 text-slate-800 text-lg font-semibold hover:bg-amber-100 transition-colors"
                              >{n}</button>
                            ))}
                            <button
                              onClick={() => { setShowCashAuth(false); setPaymentMethod(''); setCashPassword(''); setCashPasswordError('') }}
                              className="h-11 rounded-xl text-amber-700 text-xs font-semibold hover:bg-amber-100 transition-colors"
                            >Cancel</button>
                            <button
                              onClick={() => {
                                if (cashPassword.length < PIN_LENGTH) {
                                  const next = cashPassword + '0'
                                  setCashPassword(next)
                                  setCashPasswordError('')
                                  if (next.length === PIN_LENGTH) handleCashAuth(next)
                                }
                              }}
                              className="h-11 rounded-xl bg-white border border-amber-200 text-slate-800 text-lg font-semibold hover:bg-amber-100 transition-colors"
                            >0</button>
                            <button
                              onClick={() => { setCashPassword(p => p.slice(0, -1)); setCashPasswordError('') }}
                              className="h-11 rounded-xl text-amber-700 hover:bg-amber-100 flex items-center justify-center transition-colors"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Cash authorized confirmation */}
                      {opt.value === 'cash' && paymentMethod === 'cash' && cashAuthorized && (
                        <div className="mt-2 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 flex items-center gap-2">
                          <svg className="w-4 h-4 text-emerald-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-emerald-700 text-sm font-semibold">Cash payment authorized by staff</span>
                        </div>
                      )}

                      {/* Square QR panel (credit card or Apple Wallet) */}
                      {(opt.value === 'apple_wallet' || opt.value === 'credit_card') && paymentMethod === opt.value && !squarePayConfirmed && (
                        <div className="mt-2 bg-slate-900 border border-slate-700 rounded-2xl p-5 space-y-4">
                          <div className="flex items-center gap-2">
                            {paymentMethod === 'apple_wallet' ? (
                              <svg viewBox="0 0 24 24" className="w-5 h-5 text-white flex-shrink-0" fill="currentColor">
                                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                              </svg>
                            ) : (
                              <svg className="w-5 h-5 text-white flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                              </svg>
                            )}
                            <p className="text-white font-semibold text-sm">
                              {paymentMethod === 'apple_wallet' ? 'Scan with iPhone Camera to Pay' : 'Scan QR Code to Pay by Card'}
                            </p>
                          </div>

                          {squarePayLoading && (
                            <div className="flex flex-col items-center gap-3 py-6">
                              <svg className="w-8 h-8 text-slate-400 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
                              </svg>
                              <span className="text-slate-400 text-sm">Generating payment link…</span>
                            </div>
                          )}

                          {squarePayError && (
                            <div className="bg-red-900/40 border border-red-500 rounded-xl p-3 text-red-300 text-sm">
                              ⚠️ {squarePayError}
                            </div>
                          )}

                          {squarePayUrl && !squarePayLoading && (
                            <>
                              <div className="flex justify-center">
                                <div className="bg-white p-3 rounded-xl">
                                  <QRCodeSVG
                                    value={squarePayUrl}
                                    size={180}
                                    bgColor="#ffffff"
                                    fgColor="#000000"
                                    level="M"
                                  />
                                </div>
                              </div>
                              <div className="text-center">
                                <div className="text-slate-400 text-xs mb-1">Amount due</div>
                                <div className="text-white text-2xl font-bold">${headset.fee.toFixed(2)}</div>
                                <div className="text-slate-400 text-xs mt-1">
                                  {paymentMethod === 'apple_wallet' ? 'Scan with iPhone Camera to pay via Apple Wallet' : 'Scan with phone camera or open link to pay by card'}
                                </div>
                              </div>
                              <div className="flex flex-col items-center gap-2 pt-1">
                                <div className="flex items-center gap-2">
                                  <svg className="w-4 h-4 text-slate-400 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
                                  </svg>
                                  <span className="text-slate-400 text-xs">Waiting for payment…</span>
                                </div>
                                <a
                                  href={squarePayUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sky-400 text-xs underline"
                                >
                                  Open payment link
                                </a>
                              </div>
                            </>
                          )}
                        </div>
                      )}

                      {/* Payment confirmed */}
                      {(opt.value === 'apple_wallet' || opt.value === 'credit_card') && paymentMethod === opt.value && squarePayConfirmed && (
                        <div className="mt-2 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 flex items-center gap-2">
                          <svg className="w-4 h-4 text-emerald-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-emerald-700 text-sm font-semibold">
                            {opt.value === 'apple_wallet' ? 'Apple Wallet payment confirmed' : 'Card payment confirmed'}
                          </span>
                        </div>
                      )}
                    </div>
                  )
                  })}
                </div>
                {errors.paymentMethod && <p className="text-red-500 text-sm mt-2">{errors.paymentMethod}</p>}
              </div>
            </div>
          )}

          {/* Step 2: Agreement */}
          {step === 2 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
              <h2 className="text-lg font-bold text-slate-800">Responsibility Agreement</h2>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-3 text-sm text-slate-700 leading-relaxed max-h-72 overflow-y-auto">
                <p className="font-bold text-amber-800">Please read carefully before accepting:</p>
                <p>By accepting this rental agreement, <strong>{`${form.firstName} ${form.lastName}`}</strong> agrees to the following terms and conditions:</p>
                <p><strong>1. Responsibility for Equipment:</strong> You accept full financial responsibility for the headset <strong>{headset.name}</strong> ({headset.model}) during the rental period. You are responsible for any damage, loss, or theft that occurs while the equipment is in your possession.</p>
                <p><strong>2. Proper Use:</strong> You agree to use the headset only for its intended aviation purpose, handle it with care, and return it in the same condition it was provided.</p>
                <p><strong>3. Damage Policy:</strong> In the event of damage, you will be liable for the full cost of repair or replacement. The replacement value of a headset ranges from $200 to $1,100 depending on the model.</p>
                <p><strong>4. Return Obligation:</strong> You agree to return the headset to the flight school desk at the end of your rental period. Failure to return equipment may result in additional charges and loss of rental privileges.</p>
                <p><strong>5. Rental Fee:</strong> The non-refundable rental fee of <strong>${headset.fee.toFixed(2)}</strong> has been collected. This fee covers a single rental session.</p>
                <p><strong>6. Hygienic Use:</strong> You agree to clean the headset ear pads prior to and after use to maintain hygiene standards for all users.</p>
              </div>
              <button
                onClick={() => setAgreed(a => !a)}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl border-2 transition-all text-left ${
                  agreed
                    ? 'border-emerald-500 bg-emerald-50'
                    : 'border-slate-300 bg-white hover:border-slate-400'
                }`}
              >
                <div className={`w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                  agreed ? 'border-emerald-500 bg-emerald-500' : 'border-slate-400'
                }`}>
                  {agreed && (
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className={`font-semibold text-sm ${agreed ? 'text-emerald-700' : 'text-slate-600'}`}>
                  I have read and agree to the terms above. I accept responsibility for this headset.
                </span>
              </button>
            </div>
          )}

          {/* Step 3: Confirm */}
          {step === 3 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
              <h2 className="text-lg font-bold text-slate-800">Confirm Checkout</h2>
              <div className="space-y-2">
                <SummaryRow label="Headset" value={`${headset.name} — ${headset.model}`} />
                <SummaryRow label="Renter" value={`${form.firstName} ${form.lastName}`} />
                <SummaryRow label="Email" value={form.email} />
                <SummaryRow label="Payment" value={{
                  credit_card: 'Credit / Debit Card',
                  cash: 'Cash (Staff Authorized)',
                  apple_wallet: 'Apple Wallet',
                }[paymentMethod]} />
                <div className="border-t border-slate-200 pt-3 mt-3">
                  <SummaryRow label="Rental Fee" value={`$${headset.fee.toFixed(2)}`} highlight />
                </div>
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center gap-2">
                  <svg className="w-5 h-5 text-emerald-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-emerald-700 text-sm font-medium">Responsibility agreement accepted</span>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={step === 0 ? onCancel : () => setStep(s => s - 1)}
              className="flex-1 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-semibold py-4 rounded-xl transition-colors text-base"
            >
              {step === 0 ? 'Cancel' : 'Back'}
            </button>
            {step < 3 ? (
              <button
                onClick={handleNext}
                disabled={step === 2 && !agreed}
                className={`flex-1 font-semibold py-4 rounded-xl transition-colors text-base ${
                  step === 2 && !agreed
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white'
                }`}
              >
                {step === 2 ? 'I Accept — Continue' : 'Next'}
              </button>
            ) : (
              <button
                onClick={handleConfirm}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold py-4 rounded-xl transition-colors text-base"
              >
                Complete Checkout ✓
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function SummaryRow({ label, value, highlight }) {
  return (
    <div className="flex justify-between items-center py-1.5">
      <span className="text-slate-500 text-sm">{label}</span>
      <span className={`font-semibold text-sm ${highlight ? 'text-sky-700 text-base' : 'text-slate-800'}`}>{value}</span>
    </div>
  )
}
