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
// Body: { amount: number (dollars), label: string, headsetId: string }
// Returns: { checkoutUrl, orderId }
app.post('/api/square/payment-link', async (req, res) => {
  const { amount, label, headsetId } = req.body

  if (!amount || !label) {
    return res.status(400).json({ error: 'amount and label are required' })
  }

  try {
    const response = await square.checkout.paymentLinks.create({
      idempotencyKey: uuidv4(),
      order: {
        locationId: SQUARE_LOCATION_ID,
        lineItems: [
          {
            name: label,
            quantity: '1',
            basePriceMoney: {
              amount: BigInt(Math.round(amount * 100)),
              currency: 'USD',
            },
          },
        ],
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
    res.json({
      checkoutUrl: link.url,
      orderId: link.orderId,
      linkId: link.id,
    })
  } catch (err) {
    console.error('Square createPaymentLink error:', err)
    const msg = err?.errors?.[0]?.detail ?? err.message ?? 'Failed to create payment link'
    res.status(500).json({ error: msg })
  }
})

// GET /api/square/payment-status/:orderId
// Returns: { paid: boolean, status: string }
app.get('/api/square/payment-status/:orderId', async (req, res) => {
  const { orderId } = req.params

  try {
    const response = await square.orders.get(orderId)
    const order = response.order ?? response
    const paid = order?.state === 'COMPLETED'
    res.json({ paid, status: order?.state ?? 'UNKNOWN' })
  } catch (err) {
    console.error('Square retrieveOrder error:', err)
    const msg = err?.errors?.[0]?.detail ?? err.message ?? 'Failed to retrieve order'
    res.status(500).json({ error: msg })
  }
})

app.listen(PORT, () => {
  console.log(`✅  Square backend running on http://localhost:${PORT}`)
})
