<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
    <div class="bg-white p-6 rounded-2xl shadow-md text-center">
      <h2 class="text-2xl font-bold mb-4">Buy Premium Access</h2>
      <p class="mb-6 text-gray-600">Pay ₹500 to unlock exclusive features 🚀</p>
      <button
        @click="startPayment"
        class="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition"
      >
        Pay Now
      </button>
    </div>
  </div>
</template>

<script setup>
import { useToast } from 'vue-toastification'
const toast = useToast()

const startPayment = async () => {
  try {
    const order = await fetch('http://localhost:5000/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    })
    const response = await order.json()
    console.log(response)

    const options = {
      key: 'rzp_test_RGeGMOEnLzUqYw',
      amount: response.amount,
      currency: response.currency,
      name: 'My Vue Website',
      description: 'Test Transaction',
      order_id: response.id,
      handler: function (response) {
        verifyPayment(response)
      },
      prefill: {
        name: 'Your Customer',
        email: 'customer@example.com',
        contact: '9999999999',
      },
      theme: {
        color: '#3399cc',
      },
    }

    const rzp = new window.Razorpay(options)
    rzp.open()
  } catch (err) {
    console.error('Payment failed ❌', err)
  }
}

const verifyPayment = async (response) => {
  await fetch('http://localhost:4000/verify-payment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      razorpay_order_id: response.razorpay_order_id,
      razorpay_payment_id: response.razorpay_payment_id,
      razorpay_signature: response.razorpay_signature,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        toast.success('✅ Payment Verified on Server')
      } else {
        toast.error('❌ Verification Failed')
      }
    })
}
</script>
<style scoped>
.flex {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #f3f4f6;
  padding: 20px;
  box-sizing: border-box;
}

.bg-white {
  background-color: white;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  text-align: center;
}

.text-2xl {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 16px;
}

.text-gray-600 {
  color: #4b5563;
  margin-bottom: 24px;
}

button {
  background-color: #2563eb;
  color: white;
  padding: 12px 24px;
  border-radius: 16px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #1e40af;
}

@media (max-width: 768px) {
  .bg-white {
    padding: 16px;
  }
  .text-2xl {
    font-size: 20px;
  }
  button {
    padding: 10px 20px;
    font-size: 16px;
  }
}

@media (max-width: 480px) {
  .text-2xl {
    font-size: 18px;
  }
  button {
    width: 100%;
  }
}
</style>
