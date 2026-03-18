import { useState } from 'react'

function HeadsetIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M3 12a9 9 0 1 1 18 0M3 12v2a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H4.5M21 12v2a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2H19.5" />
    </svg>
  )
}

export default function CheckinFlow({ rental, headset, onConfirm, onCancel }) {
  const [condition, setCondition] = useState('')
  const [notes, setNotes] = useState('')
  const [confirmed, setConfirmed] = useState(false)

  if (!rental || !headset) return null

  const duration = Math.round((new Date() - new Date(rental.checkoutTime)) / 60000)
  const durationText = duration < 60
    ? `${duration} min`
    : `${Math.floor(duration / 60)}h ${duration % 60}m`

  const handleReturn = () => {
    onConfirm({ condition, notes })
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
        <div>
          <h1 className="text-xl font-bold">Return Headset</h1>
          <p className="text-sky-300 text-sm">Check equipment back in</p>
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-start px-8 py-8">
        <div className="w-full max-w-lg space-y-5">

          {/* Rental Summary */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-4">Rental Summary</h2>
            <div className="flex items-center gap-4 mb-5">
              <div className="w-14 h-14 rounded-xl bg-sky-50 flex items-center justify-center flex-shrink-0">
                <HeadsetIcon className="w-8 h-8 text-sky-600" />
              </div>
              <div>
                <div className="font-bold text-slate-800 text-lg">{rental.headsetName}</div>
                <div className="text-slate-500 text-sm">{rental.headsetModel}</div>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Renter</span>
                <span className="font-semibold text-slate-800">{rental.renterName}</span>
              </div>
              {rental.studentId && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Student ID</span>
                  <span className="font-medium text-slate-700">{rental.studentId}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-500">Checked Out</span>
                <span className="font-medium text-slate-700">
                  {new Date(rental.checkoutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Duration</span>
                <span className="font-medium text-slate-700">{durationText}</span>
              </div>
              <div className="flex justify-between border-t border-slate-100 pt-2 mt-2">
                <span className="text-slate-500">Rental Fee Paid</span>
                <span className="font-bold text-emerald-700">${rental.fee.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Condition Check */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <h2 className="text-lg font-bold text-slate-800">Equipment Condition on Return</h2>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => setCondition('same')}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all ${
                  condition === 'same' ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                  condition === 'same' ? 'border-emerald-500 bg-emerald-500' : 'border-slate-300'
                }`}>
                  {condition === 'same' && (
                    <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <div>
                  <div className={`font-bold text-sm ${condition === 'same' ? 'text-emerald-700' : 'text-slate-700'}`}>
                    Same condition as checkout
                  </div>
                  <div className="text-slate-500 text-xs mt-0.5">No new damage or issues</div>
                </div>
              </button>

              <button
                onClick={() => setCondition('Damaged')}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all ${
                  condition === 'Damaged' ? 'border-red-500 bg-red-50' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                  condition === 'Damaged' ? 'border-red-500 bg-red-500' : 'border-slate-300'
                }`}>
                  {condition === 'Damaged' && (
                    <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <div>
                  <div className={`font-bold text-sm ${condition === 'Damaged' ? 'text-red-700' : 'text-slate-700'}`}>
                    Damaged
                  </div>
                  <div className="text-slate-500 text-xs mt-0.5">New damage found — needs repair</div>
                </div>
              </button>
            </div>

            {condition === 'Damaged' && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                <p className="text-red-700 text-sm font-medium">
                  ⚠️ Please note damage below and notify flight school staff immediately.
                </p>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Notes{condition === 'Damaged'
                  ? <span className="text-red-500 ml-1">*</span>
                  : <span className="text-slate-400 font-normal ml-1">(optional)</span>}
              </label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder={condition === 'Damaged' ? 'Describe the damage in detail...' : 'Any notes about the headset...'}
                rows={3}
                className={`w-full border rounded-xl px-4 py-3 text-slate-800 text-sm focus:outline-none focus:ring-2 resize-none ${
                  condition === 'Damaged' && !notes.trim()
                    ? 'border-red-400 bg-red-50 focus:ring-red-400'
                    : 'border-slate-300 focus:ring-sky-500'
                }`}
              />
              {condition === 'Damaged' && !notes.trim() && (
                <p className="text-red-500 text-xs mt-1 font-medium">Please describe the damage before completing the return.</p>
              )}
            </div>
          </div>

          {/* Confirm Return */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <button
              onClick={() => setConfirmed(c => !c)}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl border-2 transition-all text-left ${
                confirmed
                  ? 'border-emerald-500 bg-emerald-50'
                  : 'border-slate-300 bg-white hover:border-slate-400'
              }`}
            >
              <div className={`w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                confirmed ? 'border-emerald-500 bg-emerald-500' : 'border-slate-400'
              }`}>
                {confirmed && (
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className={`font-semibold text-sm ${confirmed ? 'text-emerald-700' : 'text-slate-600'}`}>
                I confirm I am returning this headset and it is in the condition noted above.
              </span>
            </button>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-semibold py-4 rounded-xl transition-colors text-base"
            >
              Cancel
            </button>
            <button
              onClick={handleReturn}
              disabled={!confirmed || !condition || (condition === 'Damaged' && !notes.trim())}
              className={`flex-1 font-semibold py-4 rounded-xl transition-colors text-base ${
                confirmed && condition && !(condition === 'Damaged' && !notes.trim())
                  ? 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              Complete Return ✓
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
