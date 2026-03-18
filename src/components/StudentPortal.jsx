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

function PlaneIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M3.478 2.405a.75.75 0 0 0-.926.94l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.405Z" />
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

function BookOpenIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
    </svg>
  )
}

// Returns { weeksLeft, lessonsLeft, perWeek, isLate, daysLeft }
function calcPace(enrollment, course) {
  if (!enrollment.targetGraduationDate || !course) return null
  const total = course.totalLessons ?? 0
  const done = enrollment.lessonsCompleted ?? 0
  const remaining = Math.max(0, total - done)
  const now = new Date()
  const target = new Date(enrollment.targetGraduationDate)
  const msLeft = target - now
  const daysLeft = Math.ceil(msLeft / (1000 * 60 * 60 * 24))
  const weeksLeft = msLeft / (1000 * 60 * 60 * 24 * 7)

  if (weeksLeft <= 0) {
    return { weeksLeft: 0, lessonsLeft: remaining, perWeek: null, isLate: true, daysLeft }
  }

  const perWeek = Math.ceil(remaining / weeksLeft)
  return { weeksLeft: Math.floor(weeksLeft), lessonsLeft: remaining, perWeek, isLate: false, daysLeft }
}

// ─── Login screen ────────────────────────────────────────────────────────────
function LoginScreen({ enrollments, onLogin, onBack }) {
  const [query, setQuery] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const q = query.trim().toLowerCase()
    if (!q) { setError('Please enter your name or student ID'); return }

    const matches = enrollments.filter(en =>
      en.studentName.toLowerCase() === q ||
      (en.studentId && en.studentId.toLowerCase() === q)
    )

    if (matches.length === 0) {
      setError('No enrollments found. Check your name or student ID and try again.')
      return
    }

    const { studentName, studentId } = matches[0]
    onLogin({ studentName, studentId })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-900 via-sky-800 to-slate-900 flex flex-col">
      <div className="p-6">
        <button onClick={onBack}
          className="flex items-center gap-2 text-sky-300 hover:text-white transition-colors text-sm font-medium">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 pb-16">
        <div className="w-full max-w-sm">
          <div className="flex flex-col items-center mb-10">
            <div className="w-16 h-16 bg-sky-500/20 rounded-2xl flex items-center justify-center mb-4 ring-1 ring-sky-400/30">
              <PlaneIcon className="w-8 h-8 text-sky-300" />
            </div>
            <h1 className="text-2xl font-bold text-white">Flight School</h1>
            <p className="text-sky-300 text-sm mt-1">Student Portal</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 ring-1 ring-white/10">
            <h2 className="text-white font-semibold text-lg mb-1">View your schedule</h2>
            <p className="text-sky-300 text-sm mb-6">Enter your full name or student ID to continue</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sky-200 text-xs font-semibold uppercase tracking-wider mb-2">
                  Name or Student ID
                </label>
                <input
                  value={query}
                  onChange={e => { setQuery(e.target.value); setError('') }}
                  placeholder="e.g. Jane Smith or STU-001"
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-sky-400/60 focus:outline-none focus:ring-2 focus:ring-sky-400 text-sm"
                  autoFocus
                />
                {error && <p className="mt-2 text-red-300 text-xs">{error}</p>}
              </div>
              <button type="submit"
                className="w-full bg-sky-500 hover:bg-sky-400 text-white font-semibold py-3 rounded-xl transition-colors text-sm">
                View My Schedule
              </button>
            </form>
          </div>

          <p className="text-center text-sky-500 text-xs mt-6">
            Contact an instructor if you need help accessing your account
          </p>
        </div>
      </div>
    </div>
  )
}

// ─── Schedule screen ─────────────────────────────────────────────────────────
function ScheduleScreen({ student, myEnrollments, courses, onLogout }) {
  const [certificate, setCertificate] = useState(null)

  const active = myEnrollments.filter(e => e.status !== 'completed')
  const completed = myEnrollments.filter(e => e.status === 'completed')

  const getCourse = (courseId) => courses.find(c => c.id === courseId)

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

  // Overall lesson progress across all active courses
  const totalLessons = active.reduce((s, e) => s + (getCourse(e.courseId)?.totalLessons ?? 0), 0)
  const doneLessons = active.reduce((s, e) => s + (e.lessonsCompleted ?? 0), 0)
  const overallPct = totalLessons > 0 ? Math.round((doneLessons / totalLessons) * 100) : 0

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Header */}
      <header className="bg-sky-900 text-white px-8 py-5 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <PlaneIcon className="w-8 h-8 text-sky-300" />
          <div>
            <h1 className="text-xl font-bold">My Schedule</h1>
            <p className="text-sky-300 text-sm">Flight School Student Portal</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-sky-200 text-xs uppercase tracking-wider">Logged in as</div>
            <div className="text-white font-semibold">{student.studentName}</div>
            {student.studentId && <div className="text-sky-300 text-xs">{student.studentId}</div>}
          </div>
          <button onClick={onLogout}
            className="bg-sky-700 hover:bg-sky-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            Sign Out
          </button>
        </div>
      </header>

      {/* Stats bar */}
      <div className="bg-white border-b border-slate-200 px-8 py-4 flex items-center gap-8">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-sky-500"></div>
          <span className="text-slate-600 text-sm font-medium">{active.length} Active course{active.length !== 1 ? 's' : ''}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
          <span className="text-slate-600 text-sm font-medium">{completed.length} Completed</span>
        </div>
        {active.length > 0 && totalLessons > 0 && (
          <div className="flex items-center gap-3 ml-auto">
            <span className="text-slate-500 text-sm">Overall progress</span>
            <div className="w-32 bg-slate-200 rounded-full h-2">
              <div className="bg-sky-500 h-2 rounded-full transition-all" style={{ width: `${overallPct}%` }} />
            </div>
            <span className="text-slate-700 text-sm font-semibold">{overallPct}%</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 p-8 max-w-3xl w-full mx-auto">
        {myEnrollments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-slate-400">
            <GradCapIcon className="w-16 h-16 mb-4 opacity-30" />
            <p className="text-xl font-medium">No courses found</p>
            <p className="text-sm mt-1">Ask your instructor to enroll you in a course</p>
          </div>
        ) : (
          <div className="space-y-6">
            {active.length > 0 && (
              <section>
                <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Active Courses</h2>
                <div className="space-y-4">
                  {active.map(e => {
                    const course = getCourse(e.courseId)
                    return (
                      <CourseCard
                        key={e.id}
                        enrollment={e}
                        course={course}
                        formatDate={formatDate}
                        onViewCert={() => setCertificate({ type: 'enrollment', enrollment: e, course })}
                      />
                    )
                  })}
                </div>
              </section>
            )}

            {completed.length > 0 && (
              <section>
                <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Completed Courses</h2>
                <div className="space-y-4">
                  {[...completed].reverse().map(e => {
                    const course = getCourse(e.courseId)
                    return (
                      <CourseCard
                        key={e.id}
                        enrollment={e}
                        course={course}
                        formatDate={formatDate}
                        completed
                        onViewCert={() => setCertificate({ type: 'graduation', enrollment: e, course })}
                      />
                    )
                  })}
                </div>
              </section>
            )}
          </div>
        )}
      </div>

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

// ─── Course card ─────────────────────────────────────────────────────────────
function CourseCard({ enrollment, course, formatDate, completed, onViewCert }) {
  const total = course?.totalLessons ?? 0
  const done = enrollment.lessonsCompleted ?? 0
  const pct = total > 0 ? Math.min(100, Math.round((done / total) * 100)) : 0
  const pace = !completed ? calcPace(enrollment, course) : null

  // Pace banner color
  const paceBg = pace
    ? pace.isLate
      ? 'bg-red-50 border-red-200'
      : pace.perWeek <= 2
        ? 'bg-emerald-50 border-emerald-200'
        : pace.perWeek <= 4
          ? 'bg-amber-50 border-amber-200'
          : 'bg-orange-50 border-orange-200'
    : ''

  const paceText = pace
    ? pace.isLate
      ? 'text-red-700'
      : pace.perWeek <= 2
        ? 'text-emerald-700'
        : pace.perWeek <= 4
          ? 'text-amber-700'
          : 'text-orange-700'
    : ''

  return (
    <div className={`bg-white rounded-2xl border overflow-hidden transition-shadow hover:shadow-md ${
      completed ? 'border-emerald-200' : 'border-slate-200'
    }`}>
      {/* Main info row */}
      <div className="p-5 flex items-start gap-4">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${completed ? 'bg-emerald-50' : 'bg-sky-50'}`}>
          {completed
            ? <GradCapIcon className="w-5 h-5 text-emerald-600" />
            : <BookOpenIcon className="w-5 h-5 text-sky-600" />
          }
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-slate-800">{course?.name ?? 'Unknown Course'}</span>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_STYLES[enrollment.status]}`}>
              {STATUS_LABELS[enrollment.status]}
            </span>
          </div>

          {course?.description && (
            <p className="text-slate-500 text-sm mt-1">{course.description}</p>
          )}

          <div className="flex flex-wrap gap-x-5 gap-y-1 mt-2 text-xs text-slate-400">
            {course?.duration && (
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                {course.duration}
              </span>
            )}
            <span>Enrolled {formatDate(enrollment.enrolledAt)}</span>
            {!completed && enrollment.targetGraduationDate && (
              <span>Target: {formatDate(enrollment.targetGraduationDate)}</span>
            )}
            {enrollment.completedAt && (
              <span className="text-emerald-600 font-medium">
                Graduated {formatDate(enrollment.completedAt)}
              </span>
            )}
          </div>
        </div>

        <button
          onClick={onViewCert}
          className={`shrink-0 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors ${
            completed
              ? 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
              : 'border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          {completed ? 'Graduation Cert' : 'Enrollment Cert'}
        </button>
      </div>

      {/* Progress section — only for active courses with lesson data */}
      {!completed && total > 0 && (
        <div className="px-5 pb-5 space-y-3">
          {/* Lesson progress bar */}
          <div>
            <div className="flex justify-between text-xs text-slate-500 mb-1.5">
              <span>Lesson progress</span>
              <span className="font-semibold text-slate-700">{done} of {total} lessons completed ({pct}%)</span>
            </div>
            <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-3 rounded-full transition-all ${
                  pct >= 100 ? 'bg-emerald-500' : pct >= 60 ? 'bg-sky-500' : pct >= 30 ? 'bg-amber-400' : 'bg-sky-400'
                }`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>

          {/* Pace banner */}
          {pace && (
            <div className={`rounded-xl border px-4 py-3 ${paceBg}`}>
              {pace.isLate ? (
                <div className={`text-sm font-semibold ${paceText}`}>
                  ⚠ Target graduation date has passed — {pace.lessonsLeft} lesson{pace.lessonsLeft !== 1 ? 's' : ''} remaining. Contact your instructor to update your schedule.
                </div>
              ) : pace.lessonsLeft === 0 ? (
                <div className="text-sm font-semibold text-emerald-700">
                  ✓ All lessons complete — ask your instructor to mark you graduated!
                </div>
              ) : (
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div>
                    <div className={`text-xl font-bold ${paceText}`}>
                      {pace.perWeek} lesson{pace.perWeek !== 1 ? 's' : ''} / week
                    </div>
                    <div className={`text-xs mt-0.5 ${paceText} opacity-80`}>
                      needed to graduate on time
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-slate-600 text-sm">
                      <span className="font-semibold text-slate-800">{pace.lessonsLeft}</span> lessons left
                    </div>
                    <div className="text-slate-400 text-xs">
                      {pace.weeksLeft} week{pace.weeksLeft !== 1 ? 's' : ''} · {pace.daysLeft} days remaining
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Root export ─────────────────────────────────────────────────────────────
export default function StudentPortal({ enrollments, courses, onBack }) {
  const [student, setStudent] = useState(null)

  if (!student) {
    return (
      <LoginScreen
        enrollments={enrollments}
        onLogin={setStudent}
        onBack={onBack}
      />
    )
  }

  const myEnrollments = enrollments.filter(e =>
    e.studentName.toLowerCase() === student.studentName.toLowerCase() ||
    (student.studentId && e.studentId && e.studentId.toLowerCase() === student.studentId.toLowerCase())
  )

  return (
    <ScheduleScreen
      student={student}
      myEnrollments={myEnrollments}
      courses={courses}
      onLogout={() => setStudent(null)}
    />
  )
}
