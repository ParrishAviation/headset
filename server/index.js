import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { SquareClient, SquareEnvironment } from 'square'
import { v4 as uuidv4 } from 'uuid'

const app = express()
app.use(cors())
app.use(express.json())

const { SQUARE_ACCESS_TOKEN, SQUARE_LOCATION_ID, PORT = 3001 } = process.env

if (!SQUARE_ACCESS_TOKEN || !SQUARE_LOCATION_ID) {
  console.warn('⚠️  SQUARE_ACCESS_TOKEN or SQUARE_LOCATION_ID not set in server/.env')
}

const square = new SquareClient({
  token: SQUARE_ACCESS_TOKEN,
  environment: SquareEnvironment.Production,
})

// POST /api/square/payment-link
app.post('/api/square/payment-link', async (req, res) => {
  const { amount, label, headsetId } = req.body
  if (!amount || !label) return res.status(400).json({ error: 'amount and label are required' })

  try {
    const response = await square.checkout.paymentLinks.create({
      idempotencyKey: uuidv4(),
      order: {
        locationId: SQUARE_LOCATION_ID,
        lineItems: [{
          name: label,
          quantity: '1',
          basePriceMoney: {
            amount: BigInt(Math.round(amount * 100)),
            currency: 'USD',
          },
        }],
        referenceId: headsetId,
      },
      checkoutOptions: {
        allowTipping: false,
        askForShippingAddress: false,
        acceptedPaymentMethods: {
          applePay: true,
          googlePay: false,
          cashAppPay: false,
        },
      },
    })

    const link = response.paymentLink ?? response
    console.log(`✅ Payment link created — orderId: ${link.orderId} url: ${link.url}`)
    res.json({ checkoutUrl: link.url, orderId: link.orderId, linkId: link.id })
  } catch (err) {
    console.error('❌ createPaymentLink error:', err?.errors ?? err.message)
    res.status(500).json({ error: err?.errors?.[0]?.detail ?? err.message ?? 'Failed to create payment link' })
  }
})

// GET /api/square/payment-status/:orderId
app.get('/api/square/payment-status/:orderId', async (req, res) => {
  const { orderId } = req.params
  try {
    // Fetch the order — note: requires { orderId } object, not a bare string
    const response = await square.orders.get({ orderId })
    const order = response.order ?? response
    const state = order?.state ?? 'UNKNOWN'

    // COMPLETED = fully paid. Also check if any COMPLETED payments exist on the order.
    let paid = state === 'COMPLETED'

    if (!paid) {
      // Belt-and-suspenders: check for completed payments on this order
      try {
        const paymentsResp = await square.payments.list({ orderId })
        const payments = paymentsResp.payments ?? []
        paid = payments.some(p => p.status === 'COMPLETED')
      } catch {
        // ignore secondary check failure
      }
    }

    console.log(`🔍 Order ${orderId} — state: ${state} paid: ${paid}`)
    res.json({ paid, status: state })
  } catch (err) {
    console.error('❌ payment-status error:', err?.errors ?? err.message)
    res.status(500).json({ error: err?.errors?.[0]?.detail ?? err.message ?? 'Failed to get payment status' })
  }
})

app.listen(PORT, () => {
  console.log(`✅  Square backend running on http://localhost:${PORT}`)
})
