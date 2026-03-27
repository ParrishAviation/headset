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

// GET /api/square/payment-status/:linkId
// Square updates the original draft order in-place when paid.
// A paid order has state OPEN with tenders, and net_amount_due_money.amount === 0.
app.get('/api/square/payment-status/:linkId', async (req, res) => {
  const { linkId } = req.params
  try {
    const TOKEN = SQUARE_ACCESS_TOKEN

    // Step 1: Get the order ID from the payment link
    const linkResp = await fetch(
      `https://connect.squareup.com/v2/online-checkout/payment-links/${linkId}`,
      { headers: { Authorization: `Bearer ${TOKEN}` } }
    )
    const linkData = await linkResp.json()
    const orderId = linkData?.payment_link?.order_id
    if (!orderId) return res.json({ paid: false, status: 'UNKNOWN' })

    // Step 2: Retrieve the order directly
    const orderResp = await fetch(
      `https://connect.squareup.com/v2/orders/${orderId}`,
      { headers: { Authorization: `Bearer ${TOKEN}` } }
    )
    const orderData = await orderResp.json()
    const order = orderData?.order

    // Paid = has tenders (payments attached) AND no amount still due
    const hasTenders = Array.isArray(order?.tenders) && order.tenders.length > 0
    const amountDue = order?.net_amount_due_money?.amount ?? null
    const paid = hasTenders && amountDue === 0

    console.log(`🔍 Link ${linkId} order ${orderId} — state: ${order?.state}, tenders: ${order?.tenders?.length ?? 0}, amountDue: ${amountDue}, paid: ${paid}`)
    res.json({ paid, status: order?.state ?? 'UNKNOWN' })
  } catch (err) {
    console.error('❌ payment-status error:', err?.errors ?? err.message)
    res.status(500).json({ error: err?.errors?.[0]?.detail ?? err.message ?? 'Failed to get payment status' })
  }
})

export default app
