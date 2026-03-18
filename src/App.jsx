import { useState } from 'react'
import Dashboard from './components/Dashboard'
import CheckoutFlow from './components/CheckoutFlow'
import CheckinFlow from './components/CheckinFlow'
import AdminPanel from './components/AdminPanel'
import CoursesPanel from './components/CoursesPanel'
import StudentPortal from './components/StudentPortal'
import './index.css'

const INITIAL_HEADSETS = [
  { id: 'HS-01', name: 'Headset 01', model: 'David Clark H10-13.4', status: 'available', condition: 'Good' },
  { id: 'HS-02', name: 'Headset 02', model: 'David Clark H10-13.4', status: 'available', condition: 'Good' },
  { id: 'HS-03', name: 'Headset 03', model: 'Lightspeed Zulu 3', status: 'available', condition: 'Excellent' },
  { id: 'HS-04', name: 'Headset 04', model: 'Lightspeed Zulu 3', status: 'available', condition: 'Good' },
  { id: 'HS-05', name: 'Headset 05', model: 'Bose A20', status: 'available', condition: 'Excellent' },
  { id: 'HS-06', name: 'Headset 06', model: 'David Clark H10-13.4', status: 'available', condition: 'Fair' },
]

const INITIAL_COURSES = [
  { id: 'C-01', name: 'Private Pilot License (PPL)', duration: '40–60 flight hours', description: 'Foundation course covering basic flight maneuvers, navigation, and solo flight.', totalLessons: 40, durationWeeks: 16 },
  { id: 'C-02', name: 'Instrument Rating (IR)', duration: '50 flight hours', description: 'Advanced training for flying in low-visibility and instrument meteorological conditions.', totalLessons: 50, durationWeeks: 20 },
  { id: 'C-03', name: 'Commercial Pilot License (CPL)', duration: '200 flight hours', description: 'Professional certification to fly for compensation or hire.', totalLessons: 80, durationWeeks: 52 },
  { id: 'C-04', name: 'Multi-Engine Rating', duration: '10–15 flight hours', description: 'Training to operate aircraft with more than one engine.', totalLessons: 12, durationWeeks: 6 },
  { id: 'C-05', name: 'Flight Instructor (CFI)', duration: '25 flight hours', description: 'Certification to teach and train student pilots.', totalLessons: 25, durationWeeks: 12 },
]

const RENTAL_FEE = 15.00

export default function App() {
  const [screen, setScreen] = useState('dashboard')
  const [headsets, setHeadsets] = useState(INITIAL_HEADSETS)
  const [rentals, setRentals] = useState([])
  const [selectedHeadset, setSelectedHeadset] = useState(null)
  const [selectedRental, setSelectedRental] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [courses, setCourses] = useState(INITIAL_COURSES)
  const [enrollments, setEnrollments] = useState([])

  const handleCheckout = (headsetId) => {
    const headset = headsets.find(h => h.id === headsetId)
    setSelectedHeadset(headset)
    setScreen('checkout')
  }

  const handleCheckin = (rentalId) => {
    const rental = rentals.find(r => r.id === rentalId)
    setSelectedRental(rental)
    setScreen('checkin')
  }

  const confirmCheckout = (rentalData) => {
    const rental = {
      id: `R-${Date.now()}`,
      headsetId: selectedHeadset.id,
      headsetName: selectedHeadset.name,
      headsetModel: selectedHeadset.model,
      ...rentalData,
      checkoutTime: new Date(),
      status: 'active',
      fee: RENTAL_FEE,
    }
    setRentals(prev => [...prev, rental])
    setHeadsets(prev =>
      prev.map(h =>
        h.id === selectedHeadset.id
          ? { ...h, status: 'rented', rentedTo: rentalData.renterName }
          : h
      )
    )
    setTransactions(prev => [...prev, {
      id: `T-${Date.now()}`,
      type: 'checkout',
      rentalId: rental.id,
      headsetId: selectedHeadset.id,
      renterName: rentalData.renterName,
      amount: RENTAL_FEE,
      time: new Date(),
    }])
    setSelectedHeadset(null)
    setScreen('dashboard')
  }

  const confirmCheckin = (notes) => {
    setRentals(prev =>
      prev.map(r =>
        r.id === selectedRental.id
          ? { ...r, status: 'returned', checkinTime: new Date(), checkinNotes: notes }
          : r
      )
    )
    setHeadsets(prev =>
      prev.map(h =>
        h.id === selectedRental.headsetId
          ? { ...h, status: 'available', rentedTo: null }
          : h
      )
    )
    setSelectedRental(null)
    setScreen('dashboard')
  }

  const cancelFlow = () => {
    setSelectedHeadset(null)
    setSelectedRental(null)
    setScreen('dashboard')
  }

  const handleEnroll = ({ studentName, studentId, courseId, targetGraduationDate }) => {
    const course = courses.find(c => c.id === courseId)
    const defaultTarget = new Date()
    defaultTarget.setDate(defaultTarget.getDate() + (course?.durationWeeks ?? 12) * 7)
    const enrollment = {
      id: `E-${Date.now()}`,
      studentName,
      studentId,
      courseId,
      status: 'enrolled',
      enrolledAt: new Date(),
      completedAt: null,
      lessonsCompleted: 0,
      targetGraduationDate: targetGraduationDate ? new Date(targetGraduationDate) : defaultTarget,
    }
    setEnrollments(prev => [...prev, enrollment])
    return enrollment
  }

  const handleUpdateLessons = (enrollmentId, lessonsCompleted) => {
    setEnrollments(prev => prev.map(e =>
      e.id === enrollmentId ? { ...e, lessonsCompleted, status: lessonsCompleted > 0 ? 'in-progress' : e.status } : e
    ))
  }

  const handleGraduate = (enrollmentId) => {
    let updated = null
    setEnrollments(prev => prev.map(e => {
      if (e.id === enrollmentId) {
        updated = { ...e, status: 'completed', completedAt: new Date() }
        return updated
      }
      return e
    }))
    return updated
  }

  const handleAddCourse = (course) => {
    setCourses(prev => [...prev, { ...course, id: `C-${Date.now()}`, totalLessons: Number(course.totalLessons) || 20, durationWeeks: Number(course.durationWeeks) || 12 }])
  }

  return (
    <div className="min-h-screen bg-slate-100 font-sans">
      {screen === 'dashboard' && (
        <Dashboard
          headsets={headsets}
          rentals={rentals}
          rentalFee={RENTAL_FEE}
          onCheckout={handleCheckout}
          onCheckin={handleCheckin}
          onAdmin={() => setScreen('admin')}
          onCourses={() => setScreen('courses')}
          onStudentPortal={() => setScreen('student')}
        />
      )}
      {screen === 'checkout' && (
        <CheckoutFlow
          headset={selectedHeadset}
          rentalFee={RENTAL_FEE}
          onConfirm={confirmCheckout}
          onCancel={cancelFlow}
        />
      )}
      {screen === 'checkin' && (
        <CheckinFlow
          rental={selectedRental}
          headset={headsets.find(h => h.id === selectedRental?.headsetId)}
          onConfirm={confirmCheckin}
          onCancel={cancelFlow}
        />
      )}
      {screen === 'admin' && (
        <AdminPanel
          headsets={headsets}
          rentals={rentals}
          transactions={transactions}
          courses={courses}
          enrollments={enrollments}
          onAddCourse={handleAddCourse}
          onBack={() => setScreen('dashboard')}
        />
      )}
      {screen === 'student' && (
        <StudentPortal
          enrollments={enrollments}
          courses={courses}
          onBack={() => setScreen('dashboard')}
        />
      )}
      {screen === 'courses' && (
        <CoursesPanel
          courses={courses}
          enrollments={enrollments}
          onEnroll={handleEnroll}
          onGraduate={handleGraduate}
          onUpdateLessons={handleUpdateLessons}
          onBack={() => setScreen('dashboard')}
        />
      )}
    </div>
  )
}
