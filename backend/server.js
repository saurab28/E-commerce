import express from 'express'
import Razorpay from 'razorpay'
import cors from 'cors'
import crypto from 'crypto'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

const { RAZORPAY_API_KEY_ID, RAZORPAY_API_SECRET_KEY, PORT } = process.env

// console.log(RAZORPAY_API_KEY_ID)
// console.log(RAZORPAY_API_SECRET_KEY)
if (!RAZORPAY_API_KEY_ID || !RAZORPAY_API_SECRET_KEY) {
  throw new Error('Razorpay API keys are missing in environment variables!')
}

const razorpay = new Razorpay({
  key_id: RAZORPAY_API_KEY_ID,
  key_secret: RAZORPAY_API_SECRET_KEY,
})

app.post('/create-order', async (req, res) => {
  try {
    const { cartItems } = req.body

    if (!cartItems || !Array.isArray(cartItems)) {
      return res.status(400).json({ error: 'Invalid cart items' })
    }

    let totalAmount = 0
    cartItems.forEach((item) => {
      const price = Number(item.price) || 0
      const qty = Number(item.qty) || 0
      totalAmount += price * qty
    })

    if (totalAmount <= 0) {
      return res.status(400).json({ error: 'Cart total must be greater than 0' })
    }
    // the razorpay amount is in paise so we need to multiply by 100
    const options = {
      amount: Math.round(totalAmount * 100), 
      currency: 'INR',
      receipt: 'receipt_' + Date.now(),
    }

    const order = await razorpay.orders.create(options)
    console.log('Order Created:', order)
    res.json(order)
  } catch (err) {
    console.error('❌ Error creating order:', err)
    res.status(500).json({ error: 'Error creating order' })
  }
})

app.post('/verify-payment', (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ success: false, error: 'Missing payment details' })
  }

  try {
    const hmac = crypto.createHmac('sha256', RAZORPAY_API_SECRET_KEY)
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`)
    const generatedSignature = hmac.digest('hex')

    if (generatedSignature === razorpay_signature) {
      return res.json({ success: true })
    } else {
      return res.json({ success: false, error: 'Invalid signature' })
    }
  } catch (err) {
    console.error('❌ Error verifying payment:', err)
    res.status(500).json({ success: false, error: 'Verification failed' })
  }
})

const port = PORT || 5002
app.listen(port, () => console.log(`Backend running on http://localhost:${port}`))
