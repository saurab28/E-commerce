import express from 'express'
import cors from 'cors'
import admin from 'firebase-admin'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)

// 🔑 Load service account key
const serviceAccount = require('./serviceAccountKey.json')

const app = express()
app.use(express.json())
app.use(cors())

// ✅ Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

const db = admin.firestore()
db.settings({ ignoreUndefinedProperties: true }) // prevents crashes if frontend misses a field

// ----------------------------
// REGISTER (create user)
// ----------------------------
app.post('/register', async (req, res) => {
  const { name, username, email, password } = req.body

  if (!name || !username || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' })
  }

  try {
    // Create user in Firebase Auth
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: name,
    })

    // Save extra info in Firestore
    await db.collection('users').doc(userRecord.uid).set({
      name,
      username,
      email,
    })

    res.status(201).json({ message: 'User registered ✅', uid: userRecord.uid })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// ----------------------------
// VERIFY TOKEN (middleware)
// ----------------------------
const checkValidity = async (req, res, next) => {
  const authHeader = req.headers['authorization']
  if (!authHeader) return res.status(401).json({ error: 'No token provided' })

  const token = authHeader.split(' ')[1]
  try {
    const decoded = await admin.auth().verifyIdToken(token)
    req.user = decoded
    next()
  } catch (err) {
    res.status(403).json({ error: 'Invalid or expired token' })
  }
}

// ----------------------------
// GET USERS (protected route)
// ----------------------------
app.get('/users', checkValidity, async (req, res) => {
  try {
    const snapshot = await db.collection('users').get()
    const users = snapshot.docs.map((doc) => doc.data())
    res.status(200).json({ users, status: 200 })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ----------------------------
// ADD ITEM TO CART
// ----------------------------
// app.post('/cart', checkValidity, async (req, res) => {
//   const { productId, name, price, quantity } = req.body
//   const userId = req.user.uid

//   try {
//     await db
//       .collection('users')
//       .doc(userId)
//       .collection('cart')
//       .doc(productId) // use productId as doc ID (unique per product)
//       .set({ name, price, quantity }, { merge: true })

//     res.status(201).json({ message: '🛒 Item added to cart' })
//   } catch (err) {
//     res.status(500).json({ error: err.message })
//   }
// })

// // ----------------------------
// // GET CART ITEMS
// // ----------------------------
// app.get('/cart', checkValidity, async (req, res) => {
//   const userId = req.user.uid
//   try {
//     const snapshot = await db.collection('users').doc(userId).collection('cart').get()
//     const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
//     res.status(200).json({ items })
//   } catch (err) {
//     res.status(500).json({ error: err.message })
//   }
// })

// // ----------------------------
// // REMOVE ITEM FROM CART
// // ----------------------------
// app.delete('/cart/:productId', checkValidity, async (req, res) => {
//   const userId = req.user.uid
//   const { productId } = req.params
//   try {
//     await db.collection('users').doc(userId).collection('cart').doc(productId).delete()
//     res.status(200).json({ message: '❌ Item removed from cart' })
//   } catch (err) {
//     res.status(500).json({ error: err.message })
//   }
// })

// ----------------------------
// PING (test route)
// ----------------------------
// app.get('/ping', (req, res) => res.send('Server alive ✅'))

app.listen(5001, () => {
  console.log('🔥 Firebase Auth Server running on 5001')
})
