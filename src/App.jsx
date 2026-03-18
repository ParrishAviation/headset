import { useState } from 'react'
import Dashboard from './components/Dashboard'
import CheckoutFlow from './components/CheckoutFlow'
import CheckinFlow from './components/CheckinFlow'
import AdminPanel from './components/AdminPanel'
import './index.css'

const INITIAL_HEADSETS = [
  { id: 'HS-01', name: 'Headset 01', model: 'David Clark H10-13.4', status: 'available', condition: 'Good' },
  { id: 'HS-02', name: 'Headset 02', model: 'David Clark H10-13.4', status: 'available', condition: 'Good' },
  { id: 'HS-03', name: 'Headset 03', model: 'Lightspeed Zulu 3', status: 'available', condition: 'Excellent' },
  { id: 'HS-04', name: 'Headset 04', model: 'Lightspeed Zulu 3', status: 'available', condition: 'Good' },
  { id: 'HS-05', name: 'Headset 05', model: 'Bose A20', status: 'available', condition: 'Excellent' },
  { id: 'HS-06', name: 'Headset 06', model: 'David Clark H10-13.4', status: 'available', condition: 'Fair' },
]

const RENTAL_FEE = 15.00

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
          onBack={() => setScreen('dashboard')}
        />
      )}
    </div>
  )
}
