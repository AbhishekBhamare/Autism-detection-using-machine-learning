import express from 'express';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import mysql from 'mysql2';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import session from 'express-session';

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: 'http://localhost:3000', // Your React app URL
    credentials: true,
  })
);

// Session Configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'default_secret', // Use a strong secret in production
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // Set to true in production with HTTPS
      sameSite: 'lax', // Adjust to 'strict' if frontend/backend are on the same domain
      maxAge: 3600000, // 1 hour
    },
  })
);

// MySQL Database Connection
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Test the database connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
    process.exit(1); // Exit if the database connection fails
  }
  console.log('Connected to the database as ID', connection.threadId);
  connection.release();
});

// Routes
// Signup route
app.post('/signup', async (req, res) => {
  const { username, number, password } = req.body;

  if (!username || !number || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = 'INSERT INTO users (name, mobile_number, password) VALUES (?, ?, ?)';
    pool.query(query, [username, number, hashedPassword], (err, results) => {
      if (err) {
        console.error('Database error during signup:', err.message);
        return res.status(500).json({ message: 'Error registering user' });
      }
      res.status(201).json({ message: 'User registered successfully' });
    });
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// patient details 

app.post('/child', async (req, res) => {
  const { childName,
    parentName,
    phoneNumber,
    city,
    prediction,  } = req.body;
  console.log("Storing data:-",childName);
  if (!childName||!parentName||!phoneNumber||!city||!prediction) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const query = 'INSERT INTO patient_details (child_name, parent_name, phone_number, city, prediction) VALUES (?,?,?,?,?)';
    console.log("Query:-",query);
    pool.query(query, [childName,parentName,phoneNumber,city,prediction], (err, results) => {
    if (err) {
      console.error('Database error during signup:', err.message);
      return res.status(500).json({ message: 'Error registering user' });
    }
      res.status(201).json({ message: 'User registered successfully' });
    });
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});



// Login route
app.post('/login', async (req, res) => {
  console.log("IN the server:-",req.body);
  const { number, password } = req.body;

  if (!number || !password) {
    return res.status(400).json({ message: 'Mobile number and password are required' });
  }

  pool.query('SELECT * FROM users WHERE mobile_number = ?', [number], async (err, results) => {
    if (err) {
      console.error('Database error during login:', err.message);
      return res.status(500).json({ message: 'Internal server error' });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: 'User not found' });
    }

    const user = results[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Store session details
    req.session.userId = user.id;
    res.status(200).json({ message: 'Login successful' });
  });
});



// Middleware to check authentication
const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.userId) {
    return next();
  }
  res.status(401).json({ message: 'Unauthorized' });
};

// Dashboard route
app.get('/dashboard', isAuthenticated, (req, res) => {
  res.status(200).json({ message: 'Welcome to your dashboard!' });
});

// Auth-check route (optional for debugging session status)
app.get('/auth-check', isAuthenticated, (req, res) => {
  res.status(200).json({ message: 'User is authenticated' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
