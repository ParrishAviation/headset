import { config } from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
config({ path: join(dirname(fileURLToPath(import.meta.url)), '.env') })
import express from 'express'
import cors from 'cors'
import { SquareClient, SquareEnvironment } from 'square'
import { v4 as uuidv4 } from 'uuid'

const { SQUARE_ACCESS_TOKEN, SQUARE_LOCATION_ID } = process.env

const square = new SquareClient({
  token: SQUARE_ACCESS_TOKEN,
  environment: SquareEnvironment.Production,
})

const app = express()
app.use(cors())
app.use(express.json())

// Allow BigInt in JSON responses
app.set('json replacer', (key, value) =>
  typeof value === 'bigint' ? value.toString() : value
)

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
    const response = await square.orders.get({ orderId })
    const order = response.order ?? response
    const state = order?.state ?? 'UNKNOWN'
    let paid = state === 'COMPLETED'

    if (!paid) {
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

export default app
