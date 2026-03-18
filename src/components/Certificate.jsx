function formatDate(d) {
  return new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

function PlaneIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M3.478 2.405a.75.75 0 0 0-.926.94l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.405Z" />
    </svg>
  )
}

export default function Certificate({ type, enrollment, course, onClose }) {
  const isGrad = type === 'graduation'

  const handlePrint = () => window.print()

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 print:p-0 print:bg-white print:inset-0">
      {/* Actions (hidden on print) */}
      <div className="absolute top-4 right-4 flex gap-3 print:hidden z-10">
        <button
          onClick={handlePrint}
          className="bg-white text-slate-700 font-semibold px-5 py-2.5 rounded-xl shadow-lg hover:bg-slate-50 transition-colors text-sm flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 0 0-1.913-.247M6.34 18H5.25A2.25 2.25 0 0 1 3 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.056 48.056 0 0 1 1.913-.247m10.5 0a48.536 48.536 0 0 0-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5Zm-3 0h.008v.008H15V10.5Z" />
          </svg>
          Print Certificate
        </button>
        <button
          onClick={onClose}
          className="bg-white text-slate-700 font-semibold px-5 py-2.5 rounded-xl shadow-lg hover:bg-slate-50 transition-colors text-sm"
        >
          Close
        </button>
      </div>

      {/* Certificate */}
      <div
        id="certificate"
        className={`
          relative bg-white w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl
          print:shadow-none print:rounded-none print:max-w-none print:w-full print:h-full print:fixed print:inset-0
        `}
        style={{ aspectRatio: '1.414 / 1' }}
      >
        {/* Border decoration */}
        <div className={`absolute inset-3 rounded-xl border-4 pointer-events-none z-10 ${isGrad ? 'border-amber-400' : 'border-sky-400'}`} />
        <div className={`absolute inset-5 rounded-lg border pointer-events-none z-10 ${isGrad ? 'border-amber-200' : 'border-sky-200'}`} />

        {/* Background gradient */}
        <div className={`absolute inset-0 ${isGrad
          ? 'bg-gradient-to-br from-amber-50 via-white to-yellow-50'
          : 'bg-gradient-to-br from-sky-50 via-white to-blue-50'
        }`} />

        {/* Corner ornaments */}
        {['top-6 left-6', 'top-6 right-6', 'bottom-6 left-6', 'bottom-6 right-6'].map((pos, i) => (
          <div key={i} className={`absolute ${pos} w-8 h-8 opacity-30 ${isGrad ? 'text-amber-500' : 'text-sky-500'}`}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
            </svg>
          </div>
        ))}

        {/* Content */}
        <div className="relative z-20 flex flex-col items-center justify-center h-full px-12 py-8 text-center">
          {/* School name */}
          <div className="flex items-center gap-2 mb-1">
            <PlaneIcon className={`w-5 h-5 ${isGrad ? 'text-amber-500' : 'text-sky-500'}`} />
            <span className={`text-xs font-bold uppercase tracking-widest ${isGrad ? 'text-amber-600' : 'text-sky-600'}`}>
              Flight School
            </span>
            <PlaneIcon className={`w-5 h-5 rotate-180 ${isGrad ? 'text-amber-500' : 'text-sky-500'}`} />
          </div>

          {/* Certificate type */}
          <div className={`text-xs font-bold uppercase tracking-[0.3em] mt-1 ${isGrad ? 'text-amber-500' : 'text-sky-500'}`}>
            {isGrad ? 'Certificate of Graduation' : 'Certificate of Enrollment'}
          </div>

          {/* Divider */}
          <div className={`w-24 h-0.5 my-4 ${isGrad ? 'bg-amber-300' : 'bg-sky-300'}`} />

          {/* Body text */}
          <p className="text-slate-500 text-sm mb-2">This certifies that</p>

          <h1 className="text-4xl font-bold text-slate-800 mb-2" style={{ fontFamily: 'Georgia, serif' }}>
            {enrollment.studentName}
          </h1>

          {enrollment.studentId && (
            <p className="text-slate-400 text-xs mb-3">Student ID: {enrollment.studentId}</p>
          )}

          {isGrad ? (
            <p className="text-slate-600 text-sm leading-relaxed max-w-sm">
              has successfully completed all requirements of the
            </p>
          ) : (
            <p className="text-slate-600 text-sm leading-relaxed max-w-sm">
              has been officially enrolled in the
            </p>
          )}

          <h2 className={`text-xl font-bold mt-2 mb-1 ${isGrad ? 'text-amber-700' : 'text-sky-700'}`}>
            {course.name}
          </h2>
          <p className="text-slate-400 text-xs mb-4">{course.duration}</p>

          {isGrad ? (
            <p className="text-slate-500 text-xs">
              and is hereby awarded this certificate of graduation on{' '}
              <span className="font-semibold text-slate-700">{formatDate(enrollment.completedAt)}</span>
            </p>
          ) : (
            <p className="text-slate-500 text-xs">
              effective <span className="font-semibold text-slate-700">{formatDate(enrollment.enrolledAt)}</span>
            </p>
          )}

          {/* Signature line */}
          <div className="flex justify-around w-full mt-6">
            <div className="text-center">
              <div className={`w-28 h-px ${isGrad ? 'bg-amber-400' : 'bg-sky-400'} mb-1`} />
              <div className="text-xs text-slate-500 font-medium">Chief Flight Instructor</div>
            </div>
            <div className="text-center">
              <div className={`w-28 h-px ${isGrad ? 'bg-amber-400' : 'bg-sky-400'} mb-1`} />
              <div className="text-xs text-slate-500 font-medium">School Director</div>
            </div>
          </div>

          {/* Certificate ID */}
          <div className="absolute bottom-8 right-10 text-right">
            <div className="text-xs text-slate-300">Certificate No.</div>
            <div className="text-xs text-slate-400 font-mono">{enrollment.id}</div>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          body > * { display: none !important; }
          #certificate { display: flex !important; }
          .print\\:hidden { display: none !important; }
        }
      `}</style>
    </div>
  )
}
