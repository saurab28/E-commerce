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
const startPayment = async () => {
  try {
    // 1. Create order from backend
    const order = await fetch('http://localhost:5000/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    })
    const response = await order.json()
    console.log(response)

    // 2. Razorpay options
    const options = {
      key: 'rzp_test_RGeGMOEnLzUqYw', // only Key ID here
      amount: response.amount,
      currency: response.currency,
      name: 'My Vue Website',
      description: 'Test Transaction',
      order_id: response.id,
      handler: function (response) {
        // ✅ After payment success, verify on backend
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

// 3. Verify payment with backend
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
        alert('✅ Payment Verified on Server')
      } else {
        alert('❌ Verification Failed')
      }
    })
}
</script>
