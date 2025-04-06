// Import express.js
const express = require("express");
const path = require("path");
const db = require("./services/db");  // Import the database connection

// Create express app
const app = express();

// Add static files location
app.use(express.static("static"));  // Serve HTML, CSS, JS, images, etc.

app.get("/", (req, res) => {
    const filePath = path.join(__dirname, "..", "static", "test.html"); 
    console.log(`Serving file from: ${filePath}`); 
    res.sendFile(filePath); 
});

// Route to fetch rides from the database
app.get("/rides", async (req, res) => {
    try {
        const sql = 'SELECT * from uni_rides';

         const rides = await db.query(sql);  // Fetch ride data
        res.render(rides, {data: rides}); 
    } catch (error) {
        console.error("Database query failed:", error);
        res.status(500).send("Error fetching rides.");
    }
});


// Route to serve the rides HTML file
app.get("/rides-page", (req, res) => {
    res.sendFile(path.join(__dirname, "static", "rides.html"));
});

// Route to test the DB with drivers
app.get("/roeride-form1", async (req, res) => {
    try {
        const sql = "SELECT * FROM Drivers";
        const [results] = await db.query(sql);

        let output = '<table border="1px">';
        output += '<tr><th>Driver ID</th><th>Name</th></tr>';

        for (let row of results) {
            output += `<tr>
                        <td>${row.code}</td>
                        <td><a href="./reoride-form1/${row.code}">${row.name}</a></td>
                      </tr>`;
        }
        output += "</table>";
        res.send(output);
    } catch (error) {
        console.error(error);
        res.send("Error fetching drivers list.");
    }
});

// Route to fetch all drivers (JSON output)
app.get("/drivers", async (req, res) => {
    try {
        const sql = "SELECT * FROM Drivers";
        const [results] = await db.query(sql);
        res.json(results);
    } catch (error) {
        console.error("Database query failed:", error);
        res.status(500).send("Error fetching drivers.");
    }
});

// Route to fetch ride details by ID
app.get("/roeride/:id", async (req, res) => {
    const rideId = req.params.id;

    const rideSql = `
        SELECT r.id, d.name AS driver, b.name AS booking_type, u.name AS user, 
               r.start_location, r.end_location, r.ride_purpose
        FROM Rides r
        JOIN Drivers d ON r.driver_code = d.code
        JOIN Booking b ON r.booking_id = b.id
        JOIN Users u ON r.user_id = u.id
        WHERE r.id = ?
    `;

    try {
        const [results] = await db.query(rideSql, [rideId]);

        if (results.length === 0) {
            res.send(`No ride found with ID: ${rideId}`);
            return;
        }

        let output = `
            <div><b>Ride ID:</b> ${results[0].id}</div>
            <div><b>Driver:</b> ${results[0].driver}</div>
            <div><b>User:</b> ${results[0].user}</div>
            <div><b>Booking Type:</b> ${results[0].booking_type}</div>
            <div><b>Start Location:</b> ${results[0].start_location}</div>
            <div><b>End Location:</b> ${results[0].end_location}</div>
            <div><b>Ride Purpose:</b> ${results[0].ride_purpose}</div>
        `;

        res.send(output);
    } catch (error) {
        console.error("Error fetching ride details:", error);
        res.status(500).send("Error fetching ride details.");
    }
});

// Route to fetch all rides (HTML table output)
app.get("/roeride", async (req, res) => {
    try {
        const sql = "SELECT * FROM Rides";
        const [results] = await db.query(sql);

        let output = '<table border="1px">';
        output += '<tr><th>Ride ID</th><th>Start Location</th><th>End Location</th><th>Ride Purpose</th><th>Booking Type</th></tr>';

        for (let row of results) {
            output += `<tr>
                        <td><a href="./roeride/${row.id}">${row.id}</a></td>
                        <td>${row.start_location}</td>
                        <td>${row.end_location}</td>
                        <td>${row.ride_purpose}</td>
                        <td>${row.booking_id}</td>
                      </tr>`;
        }
        output += "</table>";
        res.send(output);
    } catch (error) {
        console.error("Database query failed:", error);
        res.status(500).send("Database query failed.");
    }
});

// Route to fetch all students (JSON output)
app.get("/students", async (req, res) => {
    try {
        const [students] = await db.query("SELECT * FROM Students");
        res.json(students);
    } catch (error) {
        console.error("Database query failed:", error);
        res.status(500).send("Error fetching students.");
    }
});

// Route for /goodbye
app.get("/goodbye", (req, res) => {
    res.send("Goodbye world!");
});

// Route for /hello/<name>
app.get("/hello/:name", (req, res) => {
    res.send(`Hello ${req.params.name}`);
});

// Start server on port 3000
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://127.0.0.1:${PORT}/`);
});


