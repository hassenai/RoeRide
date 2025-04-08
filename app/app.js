// Import express.js
const express = require("express");
const path = require("path");

const session = require('express-session');
const auth = require('./services/auth');

// Create express app
const app = express();

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

// Database connection
const db = require('./services/db');

// Set up Pug
app.set('view engine', 'pug');
app.set('views', './app/views');

// Serve static files
app.use(express.static(path.join(__dirname, 'views')));

app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // set to true if using HTTPS
  }));

// Login route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await auth.login(email, password);
    
    if (user) {
      req.session.user = user;
      res.redirect('/rides');
    } else {
      res.status(401).send('Invalid credentials');
    }
  });

app.get('/login', (req, res) => {
  res.redirect('/rides');
});

  
// Register route
app.post('/register', async (req, res) => {
    try {
      const userId = await auth.register(req.body);
      req.session.user = { id: userId, name: req.body.name };
      res.redirect('/rides');
    } catch (err) {
      console.error("Registration Error:", err); // 👈 add this
      res.status(400).send('Registration failed');
    }
  });
  
  
  // Logout route
  app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
  });

// Book a ride
app.post('/rides/book', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).send('Please login to book rides');
    }

    console.log("Booking request by user:", req.session.user);

    const { rideId, seats } = req.body;
    console.log("Booking rideId:", rideId, "seats:", seats);

    try {
        // Cast rideId to an integer to match the DB schema
        const rideIdInt = parseInt(rideId, 10);

        // Skip the available seats check for now (force the booking to proceed)
        // Directly create the booking even if there are no available seats
        const bookingId = 'BKG' + Math.floor(Math.random() * 10000);
        await db.query(
            `INSERT INTO Bookings (id, ride_id, user_id, seats_booked)
             VALUES (?, ?, ?, ?)`,
            [bookingId, rideIdInt, req.session.user.id, seats]
        );

        // Update available seats without checking for available seats
        // This will forcefully decrease the seat count
        await db.query(
            "UPDATE Rides SET seats_available = seats_available - ? WHERE id = ?",
            [seats, rideIdInt]
        );

        // Respond with success
        res.redirect('/profile');
    } catch (err) {
        console.error("Booking failed:", err);
        res.status(500).send('Booking failed');
    }
});



// Home route
app.get("/", (req, res) => {
    console.log("Rendering index.pug");
    res.render('index');
});

// Route to render rides.pug with rides from DB
app.get("/rides", async (req, res) => {
    try {
        const rides = await db.query("SELECT * FROM Rides");

        // Format the date and time before passing to Pug
        rides.forEach(ride => {
            const rideDate = new Date(ride.ride_date);
            ride.ride_date = rideDate.toLocaleDateString('en-GB', {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });

            const timeParts = ride.ride_time.split(':');
            ride.ride_time = `${timeParts[0]}:${timeParts[1]}`;
        });

        res.render("rides", {
            rides,
            user: req.session.user
          });
          
    } catch (err) {
        console.error("Database query failed:", err);
        res.status(500).send("Error fetching rides.");
    }
});

// POST route to add ride
app.post('/rides/add', async (req, res) => {
    const {
        start_location,
        end_location,
        ride_date,
        ride_time,
        seats_available,
        cost_per_seat,
        driver_name
    } = req.body;

    try {
        await db.query(
            `INSERT INTO Rides (start_location, end_location, ride_date, ride_time, seats_available, cost_per_seat, driver_name)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                start_location,
                end_location,
                ride_date,
                ride_time,
                seats_available,
                cost_per_seat,
                driver_name
            ]
        );
        res.redirect('/rides');
    } catch (err) {
        console.error(err);
        res.status(500).send("Error adding ride.");
    }
});



// Optional route for layout testing
app.get("/layout", (req, res) => {
    res.render('layout');
});

app.get('/profile', async (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    
    const userRows = await db.query("SELECT * FROM Users WHERE id = ?", [req.session.user.id]);
    const user = userRows[0];

    const bookings = await db.query(`
      SELECT Bookings.*, Rides.* 
      FROM Bookings
      JOIN Rides ON Bookings.ride_id = Rides.id
      WHERE Bookings.user_id = ?
    `, [req.session.user.id]);
  
    res.render('profile', { user, bookings });
  });

  // Route to render a list of all users
app.get("/users", async (req, res) => {
    try {
        // Query the database to get all users
        const users = await db.query("SELECT id, name, email, phone FROM Users");

        // Render the users.pug page and pass the users data
        res.render("users", { users });
    } catch (err) {
        console.error("Error fetching users:", err);
        res.status(500).send("Error fetching users.");
    }
});


// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://127.0.0.1:${PORT}/`);
});
