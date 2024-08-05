const express=require('express')
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const app=express() 

app.use(bodyParser.json());

app.use(cors());

// Open database connection and check for error 
const db = new sqlite3.Database('./database.sqlite', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
     // now we will create three table for data
    db.serialize(() => {
      db.run(`CREATE TABLE IF NOT EXISTS Users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        username TEXT NOT NULL,
        password TEXT NOT NULL,
        is_admin BOOLEAN NOT NULL
      )`);

      db.run(`CREATE TABLE IF NOT EXISTS Trains (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        train_name TEXT NOT NULL,
        source TEXT NOT NULL,
        destination TEXT NOT NULL,
        seat_capacity INTEGER NOT NULL,
        arrival_time_at_source TEXT NOT NULL,
        arrival_time_at_destination TEXT NOT NULL
      )`);

      db.run(`CREATE TABLE IF NOT EXISTS Bookings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER,
        trainId INTEGER,
        seats_booked INTEGER NOT NULL,
        FOREIGN KEY (userId) REFERENCES Users(id),
        FOREIGN KEY (trainId) REFERENCES Trains(id)
      )`);
    });
  }
});

// check if user is admin
const isAdmin = (req, res, next) => {
  const authorizationHeader = req.headers['authorization'];
  if (!authorizationHeader) return res.status(401).json({ status: 'Unauthorized', status_code: 401 });

  const token = authorizationHeader.split(' ')[1];
  if (!token) return res.status(401).json({ status: 'Unauthorized', status_code: 401 });

  jwt.verify(token, 'secret', (err, decoded) => {
    if (err) return res.status(401).json({ status: 'Unauthorized', status_code: 401 });

    db.get('SELECT is_admin FROM Users WHERE id = ?', [decoded.id], (err, row) => {
      if (err || !row || !row.is_admin) {
        return res.status(403).json({ status: 'Forbidden', status_code: 403 });
      }
      next();
    });
  });
};

// Register a User
app.post('/api/users/register', (req, res) => {
    console.log("reac");
  const { email, username, password, is_admin } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  console.log("hashedPassword")
  db.get('SELECT 1 FROM Users WHERE email = ? OR username = ?', [email, username], (err, row) => {
    if (err) {
      console.error('Error checking user existence:', err.message);
      return res.status(500).json({ status: 'Failed to register user', status_code: 500, error: err.message });
    }
    if (row) {
      return res.status(400).json({ status: 'Email or username already exists', status_code: 400 });
    }

    // Insert new user if username and email do not exist
    db.run('INSERT INTO Users (email, username, password, is_admin) VALUES (?, ?, ?, ?)', [email, username, hashedPassword, is_admin], function(err) {
      if (err) {
        console.error('Error inserting user:', err.message);
        return res.status(500).json({ status: 'Failed to register user', status_code: 500, error: err.message });
      }
      res.json({ status: 'User registered successfully', status_code: 200, user_id: this.lastID });
    });
  });
});
// Login User
app.post('/api/users/login', (req, res) => {
    const { username, password } = req.body;
  
    db.get('SELECT id, password FROM Users WHERE username = ?', [username], (err, row) => {
      if (err || !row || !bcrypt.compareSync(password, row.password)) {
        return res.status(400).json({ status: 'Invalid Credentials', status_code: 401 });
      }
      const token = jwt.sign({ id: row.id }, 'secret', { expiresIn: '1h' });
      res.json({ status: 'Login successful', status_code: 200, user_id: row.id, access_token: token });
    });
  });
  
  // Add a New Train (Admin only)
  app.post('/api/trains', isAdmin, (req, res) => {
    const { train_name, source, destination, seat_capacity, arrival_time_at_source, arrival_time_at_destination } = req.body;
  
    db.run('INSERT INTO Trains (train_name, source, destination, seat_capacity, arrival_time_at_source, arrival_time_at_destination) VALUES (?, ?, ?, ?, ?, ?)', [train_name, source, destination, seat_capacity, arrival_time_at_source, arrival_time_at_destination], function(err) {
      if (err) return res.status(500).json({ status: 'Failed to add train', status_code: 500 });
      res.json({ status: 'Train added successfully', status_code: 200, train_id: this.lastID });
    });
  });
  
  // Get Seat Availability
  app.get('/api/trains_s', (req, res) => {
    const { source, destination } = req.query;
  
    db.all('SELECT id AS train_id, train_name, seat_capacity - IFNULL((SELECT SUM(seats_booked) FROM Bookings WHERE trainId = Trains.id), 0) AS available_seats FROM Trains WHERE source = ? AND destination = ?', [source, destination], (err, rows) => {
      if (err) return res.status(500).json({ status: 'Failed to retrieve trains', status_code: 500 });
      res.json(rows);
    });
  });
  
  // Book a Seat
  app.post('/api/bookings/book', (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ status: 'Unauthorized', status_code: 401 });
  
    const { trainId, seats } = req.body;
  
    jwt.verify(token, 'secret', (err, decoded) => {
      if (err) return res.status(401).json({ status: 'Unauthorized', status_code: 401 });
  
      db.get('SELECT seat_capacity - IFNULL((SELECT SUM(seats_booked) FROM Bookings WHERE trainId = Trains.id), 0) AS available_seats FROM Trains WHERE id = ?', [trainId], (err, row) => {
        if (err || !row || row.available_seats < seats) {
          return res.status(400).json({ status: 'Not enough seats', status_code: 400 });
        }
  
        db.run('UPDATE Trains SET seat_capacity = seat_capacity - ? WHERE id = ?', [seats, trainId], function(err) {
          if (err) return res.status(500).json({ status: 'Failed to book seat', status_code: 500 });
  
          db.run('INSERT INTO Bookings (userId, trainId, seats_booked) VALUES (?, ?, ?)', [decoded.id, trainId, seats], function(err) {
            if (err) return res.status(500).json({ status: 'Failed to create booking', status_code: 500 });
            res.json({ status: 'Seat booked successfully', status_code: 200, booking_id: this.lastID, seat_number: seats });
          });
        });
      });
    });
  });
  
  // Get Specific Booking Details
  app.get('/api/bookings/:id', (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ status: 'Unauthorized', status_code: 401 });
  
    const { id } = req.params;
  
    jwt.verify(token, 'secret', (err, decoded) => {
      if (err) return res.status(401).json({ status: 'Unauthorized', status_code: 401 });
  
      db.get('SELECT Bookings.id AS booking_id, Bookings.trainId AS train_id, Trains.train_name, Bookings.userId AS user_id, Bookings.seats_booked AS number_of_seats, Bookings.seats_booked AS seat_number, Trains.arrival_time_at_source, Trains.arrival_time_at_destination FROM Bookings JOIN Trains ON Bookings.trainId = Trains.id WHERE Bookings.id = ?', [id], (err, row) => {
        if (err || !row) return res.status(404).json({ status: 'Booking not found', status_code: 404 });
        res.json(row);
      });
    });
  });
  


app.listen(5000,()=>{console.log("server on 5000")}    )
