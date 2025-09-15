import cors from 'cors';
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import express from 'express';
import jwt from 'jsonwebtoken';

const app = express();
app.use(express.json());
app.use(cors());

let db;
const JWT_SECRET = 'supersecret'; // ⚠️ Move to process.env.JWT_SECRET in prod

const initializeDB = async () => {
  db = await open({
    filename: 'goodreads.db',
    driver: sqlite3.Database,
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS Auth (
      name TEXT,
      username TEXT UNIQUE,
      password TEXT
    )
  `);
};

initializeDB();

// 📝 Register
app.post('/register', async (req, res) => {
  const { name, username, password } = req.body;
  try {
    await db.run(
      'INSERT INTO Auth (name, username, password) VALUES (?, ?, ?)',
      [name, username, password]
    );
    res.send({ message: 'User Added ✅' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 🔑 Login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await db.get(
    'SELECT * FROM Auth WHERE username = ? AND password = ?',
    [username, password]
  );

  if (!user) return res.status(400).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ username: user.username }, JWT_SECRET, {
    expiresIn: '1h',
  });

  res.json({ message: 'Login successful 🎉', token });
});

// 🛡️ Middleware for token validation
const checkValidity = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ error: 'No token provided' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // store user info in req
    next();
  } catch (err) {
    res.status(403).json({ error: 'Invalid or expired token' });
  }
};

// 👥 Protected Route
app.get('/users', checkValidity, async (req, res) => {
  const dbRes = await db.all(`SELECT name, username FROM Auth`);
  res.status(200).json({ users: dbRes, status: 200 });
});

app.listen(5001, () => {
  console.log('✅ Auth Server running on 5001');
});
