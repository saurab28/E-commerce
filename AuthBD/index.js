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
// GET CURRENT USER
// ----------------------------
app.get('/me', checkValidity, async (req, res) => {
  try {
    const userId = req.user.uid
    const docSnap = await db.collection('users').doc(userId).get()

    if (!docSnap.exists) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.status(200).json({ user: docSnap.data(), status: 200 })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ----------------------------
// PING (test route)
// ----------------------------
app.get('/ping', (req, res) => res.send('Server alive ✅'))

app.listen(5001, () => {
  console.log('🔥 Firebase Auth Server running on 5001')
})
