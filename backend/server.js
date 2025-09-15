import express from 'express';
import Razorpay from 'razorpay';
import cors from 'cors';
import crypto from 'crypto';

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Your Razorpay credentials
const razorpay = new Razorpay({
  key_id: 'rzp_test_RGeGMOEnLzUqYw',
  key_secret: 'napLniZkPKSCZSKFXKWXvDle',
});

// ✅ Create order route (with cart calculation)
app.post('/create-order', async (req, res) => {
  try {
    const { cartItems } = req.body; // [{ name, price, qty }]

    if (!cartItems || !Array.isArray(cartItems)) {
      return res.status(400).json({ error: 'Invalid cart items' });
    }

    // 🔥 Calculate total securely
    let totalAmount = 0;
    cartItems.forEach((item) => {
      const price = Number(item.price) || 0;
      const qty = Number(item.qty) || 0;
      totalAmount += price * qty;
    });

    if (totalAmount <= 0) {
      return res
        .status(400)
        .json({ error: 'Cart total must be greater than 0' });
    }

    const options = {
      amount: Math.round(totalAmount * 100), // convert ₹ → paise
      currency: 'INR',
      receipt: 'receipt_' + Date.now(),
    };

    const order = await razorpay.orders.create(options);
    console.log('✅ Order Created:', order);
    res.json(order);
  } catch (err) {
    console.error('❌ Error creating order:', err);
    res.status(500).send('Error creating order');
  }
});

// ✅ Verify payment route
app.post('/verify-payment', (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  try {
    const hmac = crypto.createHmac('sha256', razorpay.key_secret);
    hmac.update(razorpay_order_id + '|' + razorpay_payment_id);
    const generatedSignature = hmac.digest('hex');

    if (generatedSignature === razorpay_signature) {
      return res.json({ success: true });
    } else {
      return res.json({ success: false });
    }
  } catch (err) {
    console.error('❌ Error verifying payment:', err);
    res.status(500).json({ success: false, error: 'Verification failed' });
  }
});

app.listen(5000, () =>
  console.log('✅ Backend running on http://localhost:5000')
);
