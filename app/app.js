// Import express.js
const express = require("express");
const path = require("path");

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

        res.render("rides", { rides });
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
            `INSERT INTO Rides (id, start_location, end_location, ride_date, ride_time, seats_available, cost_per_seat, driver_name)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                'R' + Math.floor(Math.random() * 100000),
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

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://127.0.0.1:${PORT}/`);
});
