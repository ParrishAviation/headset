import { useState } from 'react'
import Certificate from './Certificate'

const STATUS_STYLES = {
  enrolled: 'bg-sky-100 text-sky-700',
  'in-progress': 'bg-amber-100 text-amber-700',
  completed: 'bg-emerald-100 text-emerald-700',
}

const STATUS_LABELS = {
  enrolled: 'Enrolled',
  'in-progress': 'In Progress',
  completed: 'Completed',
}

function BookIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
    </svg>
  )
}

function GradCapIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
    </svg>
  )
}

function toDateInputValue(date) {
  const d = new Date(date)
  return d.toISOString().split('T')[0]
}

function EnrollModal({ courses, onEnroll, onClose }) {
  const [name, setName] = useState('')
  const [studentId, setStudentId] = useState('')
  const [courseId, setCourseId] = useState(courses[0]?.id || '')
  const [targetDate, setTargetDate] = useState(() => {
    const d = new Date()
    const defaultWeeks = courses[0]?.durationWeeks ?? 12
    d.setDate(d.getDate() + defaultWeeks * 7)
    return toDateInputValue(d)
  })
  const [error, setError] = useState('')

  const handleCourseChange = (id) => {
    setCourseId(id)
    const course = courses.find(c => c.id === id)
    const d = new Date()
    d.setDate(d.getDate() + (course?.durationWeeks ?? 12) * 7)
    setTargetDate(toDateInputValue(d))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim()) { setError('Student name is required'); return }
    if (!courseId) { setError('Please select a course'); return }
    onEnroll({ studentName: name.trim(), studentId: studentId.trim(), courseId, targetGraduationDate: targetDate })
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="px-6 pt-6 pb-4 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800">Enroll Student</h2>
          <p className="text-slate-500 text-sm mt-1">Student will receive an enrollment certificate</p>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Student Name *</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Full name"
              className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Student ID <span className="font-normal text-slate-400">(optional)</span></label>
            <input
              value={studentId}
              onChange={e => setStudentId(e.target.value)}
              placeholder="e.g. STU-001"
              className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Course *</label>
            <select
              value={courseId}
              onChange={e => handleCourseChange(e.target.value)}
              className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 bg-white"
            >
              {courses.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Target Graduation Date</label>
            <input
              type="date"
              value={targetDate}
              onChange={e => setTargetDate(e.target.value)}
              min={toDateInputValue(new Date())}
              className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
            <p className="text-slate-400 text-xs mt-1">Auto-set based on course length — adjust as needed</p>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 border border-slate-300 text-slate-600 font-semibold py-2.5 rounded-xl hover:bg-slate-50 transition-colors text-sm">
              Cancel
            </button>
            <button type="submit"
              className="flex-1 bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm">
              Enroll & Print Certificate
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function CoursesPanel({ courses, enrollments, onEnroll, onGraduate, onUpdateLessons, onBack }) {
  const [tab, setTab] = useState('enrollments')
  const [showEnrollModal, setShowEnrollModal] = useState(false)
  const [certificate, setCertificate] = useState(null)

  const handleEnroll = ({ studentName, studentId, courseId, targetGraduationDate }) => {
    const course = courses.find(c => c.id === courseId)
    const enrollment = onEnroll({ studentName, studentId, courseId, targetGraduationDate })
    setShowEnrollModal(false)
    setCertificate({ type: 'enrollment', enrollment, course })
  }

  const handleGraduate = (enrollmentId) => {
    const updated = onGraduate(enrollmentId)
    if (updated) {
      const course = courses.find(c => c.id === updated.courseId)
      setCertificate({ type: 'graduation', enrollment: updated, course })
    }
  }

  const getCourseName = (courseId) => courses.find(c => c.id === courseId)?.name || courseId
  const getCourse = (courseId) => courses.find(c => c.id === courseId)

  const activeEnrollments = enrollments.filter(e => e.status !== 'completed')
  const completedEnrollments = enrollments.filter(e => e.status === 'completed')

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Header */}
      <header className="bg-sky-900 text-white px-8 py-5 flex items-center gap-4 shadow-lg">
        <button onClick={onBack} className="p-2 rounded-lg hover:bg-sky-800 transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex items-center gap-3">
          <GradCapIcon className="w-8 h-8 text-sky-300" />
          <div>
            <h1 className="text-xl font-bold">Course Enrollment</h1>
            <p className="text-sky-300 text-sm">Student enrollment & certificates</p>
          </div>
        </div>
        <div className="ml-auto">
          <button
            onClick={() => setShowEnrollModal(true)}
            className="bg-white text-sky-900 font-semibold px-5 py-2.5 rounded-xl hover:bg-sky-50 transition-colors text-sm flex items-center gap-2"
          >
            <span className="text-lg">+</span> Enroll Student
          </button>
        </div>
      </header>

      {/* Stats Bar */}
      <div className="bg-white border-b border-slate-200 px-8 py-4 flex gap-8">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-sky-500"></div>
          <span className="text-slate-600 text-sm font-medium">{activeEnrollments.length} Active</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
          <span className="text-slate-600 text-sm font-medium">{completedEnrollments.length} Graduated</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-violet-400"></div>
          <span className="text-slate-600 text-sm font-medium">{courses.length} Courses</span>
        </div>
      </div>

      {/* Tab Nav */}
      <div className="bg-white border-b border-slate-200 px-8">
        <div className="flex gap-1">
          {[
            { key: 'enrollments', label: `Active (${activeEnrollments.length})` },
            { key: 'completed', label: `Completed (${completedEnrollments.length})` },
            { key: 'courses', label: `Courses (${courses.length})` },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`px-6 py-4 text-sm font-semibold border-b-2 transition-colors ${
                tab === t.key ? 'border-sky-600 text-sky-700' : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-8">
        {tab === 'enrollments' && (
          <div className="max-w-3xl">
            {activeEnrollments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-slate-400">
                <GradCapIcon className="w-16 h-16 mb-4 opacity-30" />
                <p className="text-xl font-medium">No active enrollments</p>
                <p className="text-sm mt-1">Enroll a student to get started</p>
                <button onClick={() => setShowEnrollModal(true)}
                  className="mt-6 bg-sky-600 hover:bg-sky-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm">
                  Enroll Student
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {activeEnrollments.map(e => (
                  <EnrollmentCard
                    key={e.id}
                    enrollment={e}
                    course={getCourse(e.courseId)}
                    courseName={getCourseName(e.courseId)}
                    onGraduate={() => handleGraduate(e.id)}
                    onUpdateLessons={(n) => onUpdateLessons(e.id, n)}
                    onViewCert={() => {
                      const course = courses.find(c => c.id === e.courseId)
                      setCertificate({ type: 'enrollment', enrollment: e, course })
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'completed' && (
          <div className="max-w-3xl">
            {completedEnrollments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-slate-400">
                <GradCapIcon className="w-16 h-16 mb-4 opacity-30" />
                <p className="text-xl font-medium">No graduates yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {[...completedEnrollments].reverse().map(e => (
                  <EnrollmentCard
                    key={e.id}
                    enrollment={e}
                    course={getCourse(e.courseId)}
                    courseName={getCourseName(e.courseId)}
                    completed
                    onViewCert={() => {
                      const course = courses.find(c => c.id === e.courseId)
                      setCertificate({ type: 'graduation', enrollment: e, course })
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'courses' && (
          <div className="max-w-3xl grid grid-cols-2 gap-4">
            {courses.map(c => {
              const enrolled = enrollments.filter(e => e.courseId === c.id).length
              const graduated = enrollments.filter(e => e.courseId === c.id && e.status === 'completed').length
              return (
                <div key={c.id} className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center">
                      <BookIcon className="w-5 h-5 text-sky-600" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-800">{c.name}</div>
                      <div className="text-slate-400 text-xs">{c.duration} · {c.totalLessons} lessons</div>
                    </div>
                  </div>
                  <p className="text-slate-500 text-sm">{c.description}</p>
                  <div className="flex gap-4 pt-1 text-xs text-slate-500">
                    <span><b className="text-slate-700">{enrolled}</b> enrolled</span>
                    <span><b className="text-emerald-600">{graduated}</b> graduated</span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {showEnrollModal && (
        <EnrollModal
          courses={courses}
          onEnroll={handleEnroll}
          onClose={() => setShowEnrollModal(false)}
        />
      )}

      {certificate && (
        <Certificate
          type={certificate.type}
          enrollment={certificate.enrollment}
          course={certificate.course}
          onClose={() => setCertificate(null)}
        />
      )}
    </div>
  )
}

function EnrollmentCard({ enrollment, course, courseName, completed, onGraduate, onUpdateLessons, onViewCert }) {
  const formatDate = (d) => new Date(d).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })

  const total = course?.totalLessons ?? 0
  const done = enrollment.lessonsCompleted ?? 0
  const pct = total > 0 ? Math.min(100, Math.round((done / total) * 100)) : 0

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
      {/* Top row */}
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${completed ? 'bg-emerald-50' : 'bg-sky-50'}`}>
          <GradCapIcon className={`w-5 h-5 ${completed ? 'text-emerald-600' : 'text-sky-600'}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-slate-800">{enrollment.studentName}</span>
            {enrollment.studentId && (
              <span className="text-xs text-slate-400 font-medium">{enrollment.studentId}</span>
            )}
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_STYLES[enrollment.status]}`}>
              {STATUS_LABELS[enrollment.status]}
            </span>
          </div>
          <div className="text-slate-500 text-sm mt-0.5">{courseName}</div>
          <div className="text-slate-400 text-xs mt-0.5">
            Enrolled {formatDate(enrollment.enrolledAt)}
            {enrollment.targetGraduationDate && !completed && (
              <> · Target: {formatDate(enrollment.targetGraduationDate)}</>
            )}
            {enrollment.completedAt && ` · Graduated ${formatDate(enrollment.completedAt)}`}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button onClick={onViewCert}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
            {completed ? 'Grad Certificate' : 'Enrollment Cert'}
          </button>
          {!completed && onGraduate && (
            <button onClick={onGraduate}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors">
              Mark Graduated
            </button>
          )}
        </div>
      </div>

      {/* Progress row — instructor can update lessons */}
      {!completed && total > 0 && (
        <div className="bg-slate-50 rounded-xl px-4 py-3 flex items-center gap-4">
          <div className="flex-1">
            <div className="flex justify-between text-xs text-slate-500 mb-1.5">
              <span>Lessons completed</span>
              <span className="font-semibold text-slate-700">{done} / {total}</span>
            </div>
            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-2 rounded-full transition-all bg-sky-500"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => onUpdateLessons(Math.max(0, done - 1))}
              className="w-7 h-7 rounded-lg bg-white border border-slate-300 text-slate-600 hover:bg-slate-100 flex items-center justify-center font-bold text-base transition-colors"
            >−</button>
            <span className="w-8 text-center text-sm font-bold text-slate-700">{done}</span>
            <button
              onClick={() => onUpdateLessons(Math.min(total, done + 1))}
              className="w-7 h-7 rounded-lg bg-white border border-slate-300 text-slate-600 hover:bg-slate-100 flex items-center justify-center font-bold text-base transition-colors"
            >+</button>
          </div>
        </div>
      )}
    </div>
  )
}
