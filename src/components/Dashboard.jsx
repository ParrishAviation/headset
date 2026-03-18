import { useState } from 'react'

const conditionColors = {
  Excellent: 'bg-emerald-100 text-emerald-700',
  Good: 'bg-blue-100 text-blue-700',
  Fair: 'bg-yellow-100 text-yellow-700',
  Poor: 'bg-red-100 text-red-700',
}

function HeadsetIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M3 12a9 9 0 1 1 18 0M3 12v2a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H4.5M21 12v2a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2H19.5" />
    </svg>
  )
}

export default function Dashboard({ headsets, rentals, rentalFee, onCheckout, onCheckin, onAdmin }) {
  const [tab, setTab] = useState('available')

  const available = headsets.filter(h => h.status === 'available')
  const rented = headsets.filter(h => h.status === 'rented')
  const activeRentals = rentals.filter(r => r.status === 'active')

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString([], { month: 'short', day: 'numeric' })
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Header */}
      <header className="bg-sky-900 text-white px-8 py-5 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-4">
          <HeadsetIcon className="w-10 h-10 text-sky-300" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Flight School Headset Rental</h1>
            <p className="text-sky-300 text-sm mt-0.5">Equipment Check-Out System</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-sky-200 text-xs uppercase tracking-wider">Rental Fee</div>
            <div className="text-2xl font-bold text-white">${rentalFee.toFixed(2)}</div>
          </div>
          <button
            onClick={onAdmin}
            className="bg-sky-700 hover:bg-sky-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Admin
          </button>
        </div>
      </header>

      {/* Stats Bar */}
      <div className="bg-white border-b border-slate-200 px-8 py-4 flex gap-8">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
          <span className="text-slate-600 text-sm font-medium">{available.length} Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-amber-500"></div>
          <span className="text-slate-600 text-sm font-medium">{rented.length} Rented Out</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-slate-400"></div>
          <span className="text-slate-600 text-sm font-medium">{headsets.length} Total Headsets</span>
        </div>
      </div>

      {/* Tab Nav */}
      <div className="bg-white border-b border-slate-200 px-8">
        <div className="flex gap-1">
          {[
            { key: 'available', label: `Available (${available.length})` },
            { key: 'rented', label: `Rented Out (${rented.length})` },
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

      {/* Content */}
      <div className="flex-1 p-8">
        {tab === 'available' && (
          <div>
            {available.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-slate-400">
                <HeadsetIcon className="w-16 h-16 mb-4 opacity-30" />
                <p className="text-xl font-medium">No headsets available</p>
                <p className="text-sm mt-1">All headsets are currently rented out</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-5 max-w-4xl">
                {available.map(headset => (
                  <div key={headset.id}
                    className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col gap-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-sky-50 flex items-center justify-center">
                          <HeadsetIcon className="w-7 h-7 text-sky-600" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-800 text-lg">{headset.name}</div>
                          <div className="text-slate-500 text-sm">{headset.model}</div>
                        </div>
                      </div>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${conditionColors[headset.condition]}`}>
                        {headset.condition}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                      <span className="text-emerald-600 text-sm font-medium">Available for rental</span>
                    </div>
                    <button
                      onClick={() => onCheckout(headset.id)}
                      className="w-full bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white font-semibold py-3.5 rounded-xl transition-colors text-base"
                    >
                      Rent This Headset — ${rentalFee.toFixed(2)}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'rented' && (
          <div>
            {activeRentals.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-slate-400">
                <HeadsetIcon className="w-16 h-16 mb-4 opacity-30" />
                <p className="text-xl font-medium">No active rentals</p>
                <p className="text-sm mt-1">All headsets have been returned</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-5 max-w-4xl">
                {activeRentals.map(rental => (
                  <div key={rental.id}
                    className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col gap-4"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center">
                          <HeadsetIcon className="w-7 h-7 text-amber-600" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-800 text-lg">{rental.headsetName}</div>
                          <div className="text-slate-500 text-sm">{rental.headsetModel}</div>
                        </div>
                      </div>
                      <span className="bg-amber-100 text-amber-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                        Rented Out
                      </span>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-3 space-y-1.5">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Renter</span>
                        <span className="font-semibold text-slate-800">{rental.renterName}</span>
                      </div>
                      {rental.studentId && (
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-500">Student ID</span>
                          <span className="font-medium text-slate-700">{rental.studentId}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Checked Out</span>
                        <span className="font-medium text-slate-700">{formatDate(rental.checkoutTime)} at {formatTime(rental.checkoutTime)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Fee Paid</span>
                        <span className="font-semibold text-emerald-700">${rental.fee.toFixed(2)}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => onCheckin(rental.id)}
                      className="w-full bg-slate-800 hover:bg-slate-700 active:bg-slate-900 text-white font-semibold py-3.5 rounded-xl transition-colors text-base"
                    >
                      Return Headset
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
