import { useState } from 'react'
import Dashboard from './components/Dashboard'
import CheckoutFlow from './components/CheckoutFlow'
import CheckinFlow from './components/CheckinFlow'
import AdminPanel from './components/AdminPanel'
import AdminPinScreen from './components/AdminPinScreen'
import './index.css'

const INITIAL_HEADSETS = [
  { id: 'HS-01', name: 'Lightspeed Zulu A', model: 'Lightspeed Zulu 3', status: 'available', condition: 'Excellent', fee: 10.00 },
  { id: 'HS-02', name: 'Lightspeed Zulu B', model: 'Lightspeed Zulu 3', status: 'available', condition: 'Good', fee: 10.00 },
  { id: 'HS-03', name: 'David Clark A', model: 'David Clark H10-13.4', status: 'available', condition: 'Good', fee: 5.00 },
  { id: 'HS-04', name: 'David Clark B', model: 'David Clark H10-13.4', status: 'available', condition: 'Good', fee: 5.00 },
]

export default function App() {
  const [screen, setScreen] = useState('dashboard')
  const [headsets, setHeadsets] = useState(INITIAL_HEADSETS)
  const [rentals, setRentals] = useState([])
  const [selectedHeadset, setSelectedHeadset] = useState(null)
  const [selectedRental, setSelectedRental] = useState(null)
  const [transactions, setTransactions] = useState([])

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
      fee: selectedHeadset.fee,
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
      amount: selectedHeadset.fee,
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

  return (
    <div className="min-h-screen bg-slate-100 font-sans">
      {screen === 'dashboard' && (
        <Dashboard
          headsets={headsets}
          rentals={rentals}
          onCheckout={handleCheckout}
          onCheckin={handleCheckin}
          onAdmin={() => setScreen('adminPin')}
        />
      )}
      {screen === 'checkout' && (
        <CheckoutFlow
          headset={selectedHeadset}
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
      {screen === 'adminPin' && (
        <AdminPinScreen
          onSuccess={() => setScreen('admin')}
          onCancel={() => setScreen('dashboard')}
        />
      )}
      {screen === 'admin' && (
        <AdminPanel
          headsets={headsets}
          rentals={rentals}
          transactions={transactions}
          onBack={() => setScreen('dashboard')}
        />
      )}
    </div>
  )
}
