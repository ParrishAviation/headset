import { useState } from 'react'

function GradCapIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
    </svg>
  )
}

function HeadsetIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M3 12a9 9 0 1 1 18 0M3 12v2a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H4.5M21 12v2a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2H19.5" />
    </svg>
  )
}

const conditionColors = {
  Excellent: 'bg-emerald-100 text-emerald-700',
  Good: 'bg-blue-100 text-blue-700',
  Fair: 'bg-yellow-100 text-yellow-700',
  Poor: 'bg-red-100 text-red-700',
  Damaged: 'bg-red-100 text-red-700',
}

export default function AdminPanel({ headsets, rentals, transactions, courses, enrollments, onAddCourse, onBack }) {
  const [tab, setTab] = useState('overview')
  const [showAddCourse, setShowAddCourse] = useState(false)
  const [newCourse, setNewCourse] = useState({ name: '', duration: '', description: '' })

  const activeRentals = rentals.filter(r => r.status === 'active')
  const completedRentals = rentals.filter(r => r.status === 'returned')
  const totalRevenue = transactions.reduce((sum, t) => sum + t.amount, 0)
  const activeEnrollments = (enrollments || []).filter(e => e.status !== 'completed')
  const graduates = (enrollments || []).filter(e => e.status === 'completed')

  const formatDateTime = (date) => {
    return new Date(date).toLocaleString([], {
      month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    })
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <header className="bg-sky-900 text-white px-8 py-5 flex items-center gap-4 shadow-lg">
        <button onClick={onBack} className="p-2 rounded-lg hover:bg-sky-800 transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h1 className="text-xl font-bold">Admin Panel</h1>
          <p className="text-sky-300 text-sm">Rental management & reports</p>
        </div>
      </header>

      {/* Tab Nav */}
      <div className="bg-white border-b border-slate-200 px-8">
        <div className="flex gap-1">
          {[
            { key: 'overview', label: 'Overview' },
            { key: 'rentals', label: `All Rentals (${rentals.length})` },
            { key: 'headsets', label: 'Headsets' },
            { key: 'courses', label: `Courses (${(courses || []).length})` },
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

      <div className="flex-1 p-8">
        {tab === 'overview' && (
          <div className="space-y-6 max-w-3xl">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <StatCard
                label="Total Revenue"
                value={`$${totalRevenue.toFixed(2)}`}
                sub={`${transactions.length} transaction${transactions.length !== 1 ? 's' : ''}`}
                color="emerald"
                icon="💰"
              />
              <StatCard
                label="Active Rentals"
                value={activeRentals.length}
                sub="currently out"
                color="amber"
                icon="🔑"
              />
              <StatCard
                label="Completed Returns"
                value={completedRentals.length}
                sub="all time"
                color="sky"
                icon="✅"
              />
              <StatCard
                label="Headsets Available"
                value={headsets.filter(h => h.status === 'available').length}
                sub={`of ${headsets.length} total`}
                color="violet"
                icon="🎧"
              />
            </div>

            {/* Active rentals quick view */}
            {activeRentals.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <h2 className="font-bold text-slate-800 text-base mb-4">Currently Out</h2>
                <div className="space-y-3">
                  {activeRentals.map(r => (
                    <div key={r.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                      <div>
                        <span className="font-semibold text-slate-800 text-sm">{r.renterName}</span>
                        <span className="text-slate-500 text-sm ml-2">— {r.headsetName}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-slate-500">{formatDateTime(r.checkoutTime)}</div>
                        <div className="text-sm font-semibold text-sky-700">${r.fee.toFixed(2)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {tab === 'rentals' && (
          <div className="max-w-3xl">
            {rentals.length === 0 ? (
              <div className="text-center py-20 text-slate-400">
                <p className="text-xl font-medium">No rental history yet</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="text-left px-5 py-3.5 font-semibold text-slate-600">Renter</th>
                      <th className="text-left px-5 py-3.5 font-semibold text-slate-600">Headset</th>
                      <th className="text-left px-5 py-3.5 font-semibold text-slate-600">Checked Out</th>
                      <th className="text-left px-5 py-3.5 font-semibold text-slate-600">Returned</th>
                      <th className="text-right px-5 py-3.5 font-semibold text-slate-600">Fee</th>
                      <th className="text-center px-5 py-3.5 font-semibold text-slate-600">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...rentals].reverse().map(r => (
                      <tr key={r.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="px-5 py-3.5">
                          <div className="font-semibold text-slate-800">{r.renterName}</div>
                          {r.studentId && <div className="text-slate-400 text-xs">{r.studentId}</div>}
                        </td>
                        <td className="px-5 py-3.5 text-slate-600">{r.headsetName}</td>
                        <td className="px-5 py-3.5 text-slate-600">{formatDateTime(r.checkoutTime)}</td>
                        <td className="px-5 py-3.5 text-slate-600">
                          {r.checkinTime ? formatDateTime(r.checkinTime) : '—'}
                        </td>
                        <td className="px-5 py-3.5 text-right font-semibold text-slate-800">
                          ${r.fee.toFixed(2)}
                        </td>
                        <td className="px-5 py-3.5 text-center">
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                            r.status === 'active'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-emerald-100 text-emerald-700'
                          }`}>
                            {r.status === 'active' ? 'Out' : 'Returned'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {tab === 'courses' && (
          <div className="max-w-3xl space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <StatCard label="Active Enrollments" value={activeEnrollments.length} sub="students in progress" color="sky" icon="📚" />
              <StatCard label="Graduates" value={graduates.length} sub="completed courses" color="emerald" icon="🎓" />
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                <h2 className="font-bold text-slate-800">Course Catalog</h2>
                <button
                  onClick={() => setShowAddCourse(v => !v)}
                  className="text-sm font-semibold bg-sky-600 hover:bg-sky-700 text-white px-4 py-1.5 rounded-lg transition-colors"
                >
                  + Add Course
                </button>
              </div>
              {showAddCourse && (
                <div className="px-5 py-4 bg-slate-50 border-b border-slate-100 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Course Name *</label>
                      <input value={newCourse.name} onChange={e => setNewCourse(p => ({ ...p, name: e.target.value }))}
                        placeholder="e.g. Night Rating"
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Duration</label>
                      <input value={newCourse.duration} onChange={e => setNewCourse(p => ({ ...p, duration: e.target.value }))}
                        placeholder="e.g. 10 flight hours"
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Description</label>
                    <input value={newCourse.description} onChange={e => setNewCourse(p => ({ ...p, description: e.target.value }))}
                      placeholder="Short description of the course"
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400" />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setShowAddCourse(false)}
                      className="text-sm border border-slate-300 text-slate-600 px-4 py-1.5 rounded-lg hover:bg-white transition-colors">Cancel</button>
                    <button
                      onClick={() => {
                        if (!newCourse.name.trim()) return
                        onAddCourse(newCourse)
                        setNewCourse({ name: '', duration: '', description: '' })
                        setShowAddCourse(false)
                      }}
                      className="text-sm bg-sky-600 hover:bg-sky-700 text-white px-4 py-1.5 rounded-lg transition-colors font-semibold">
                      Save Course
                    </button>
                  </div>
                </div>
              )}
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="text-left px-5 py-3 font-semibold text-slate-600">Course</th>
                    <th className="text-left px-5 py-3 font-semibold text-slate-600">Duration</th>
                    <th className="text-center px-5 py-3 font-semibold text-slate-600">Enrolled</th>
                    <th className="text-center px-5 py-3 font-semibold text-slate-600">Graduated</th>
                  </tr>
                </thead>
                <tbody>
                  {(courses || []).map(c => {
                    const enrolled = (enrollments || []).filter(e => e.courseId === c.id).length
                    const graduated = (enrollments || []).filter(e => e.courseId === c.id && e.status === 'completed').length
                    return (
                      <tr key={c.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2">
                            <GradCapIcon className="w-4 h-4 text-slate-400" />
                            <div>
                              <div className="font-semibold text-slate-800">{c.name}</div>
                              {c.description && <div className="text-slate-400 text-xs">{c.description}</div>}
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-slate-600 text-xs">{c.duration}</td>
                        <td className="px-5 py-3.5 text-center font-semibold text-sky-700">{enrolled}</td>
                        <td className="px-5 py-3.5 text-center font-semibold text-emerald-700">{graduated}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'headsets' && (
          <div className="max-w-3xl">
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="text-left px-5 py-3.5 font-semibold text-slate-600">Headset</th>
                    <th className="text-left px-5 py-3.5 font-semibold text-slate-600">Model</th>
                    <th className="text-center px-5 py-3.5 font-semibold text-slate-600">Condition</th>
                    <th className="text-center px-5 py-3.5 font-semibold text-slate-600">Status</th>
                    <th className="text-left px-5 py-3.5 font-semibold text-slate-600">Rented To</th>
                  </tr>
                </thead>
                <tbody>
                  {headsets.map(h => (
                    <tr key={h.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <HeadsetIcon className="w-5 h-5 text-slate-400" />
                          <span className="font-semibold text-slate-800">{h.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-slate-600">{h.model}</td>
                      <td className="px-5 py-3.5 text-center">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${conditionColors[h.condition]}`}>
                          {h.condition}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                          h.status === 'available'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}>
                          {h.status === 'available' ? 'Available' : 'Rented Out'}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-slate-600">{h.rentedTo || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({ label, value, sub, color, icon }) {
  const colors = {
    emerald: 'bg-emerald-50 border-emerald-200',
    amber: 'bg-amber-50 border-amber-200',
    sky: 'bg-sky-50 border-sky-200',
    violet: 'bg-violet-50 border-violet-200',
  }
  const textColors = {
    emerald: 'text-emerald-700',
    amber: 'text-amber-700',
    sky: 'text-sky-700',
    violet: 'text-violet-700',
  }

  return (
    <div className={`rounded-2xl border p-5 ${colors[color]}`}>
      <div className="text-2xl mb-1">{icon}</div>
      <div className={`text-3xl font-bold ${textColors[color]}`}>{value}</div>
      <div className="text-slate-700 font-semibold text-sm mt-1">{label}</div>
      <div className="text-slate-500 text-xs mt-0.5">{sub}</div>
    </div>
  )
}
