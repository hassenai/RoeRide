// Import express.js
const express = require("express");

// Create express app
var app = express();

// Add static files location
app.use(express.static("static"));

// Get the functions in the db.js file to use
const db = require('./services/db');

// Use the Pug templating engine
app.set('view engine', 'pug');
app.set('views', './app/views');

// Create a route for root - /
app.get("/", function(req, res) {
    res.send("Hello world!");
});

// Create a route for testing the db
app.get("/roeride-form1", function(req, res) {
    var sql = 'SELECT * FROM Drivers';

    var output = '<table border="1px">';
    output += '<tr><th>Driver ID</th><th>Name</th></tr>';

    db.query(sql).then(results => {
        for (var row of results) {
            output += '<tr>';
            output += '<td>' + row.code + '</td>';
            output += '<td><a href="./reoride-form1/' + row.code + '">' + row.name + '</a></td>';
            output += '</tr>';
        }
        output += '</table>';
        res.send(output);
    }).catch(err => {
        console.error(err);
        res.send("Error fetching drivers list.");
    });
});


app.get("/drivers", function(req, res) {
    sql = 'SELECT * FROM Drivers';
    db.query(sql).then(results => {
        console.log(results);
        res.json(results);
    });
});

app.get("/roeride/:id", function(req, res) {
    var rideId = req.params.id;
    console.log(rideId);

    var rideSql = `
        SELECT r.id, d.name AS driver, b.name AS booking_type, u.name AS user, 
               r.start_location, r.end_location, r.ride_purpose
        FROM Rides r
        JOIN Drivers d ON r.driver_code = d.code
        JOIN Booking b ON r.booking_id = b.id
        JOIN Users u ON r.user_id = u.id
        WHERE r.id = ?`;

    db.query(rideSql, [rideId]).then(results => {
        if (results.length === 0) {
            res.send("No ride found with ID: " + rideId);
            return;
        }

        var output = '';
        output += '<div><b>Ride ID:</b> ' + results[0].id + '</div>';
        output += '<div><b>Driver:</b> ' + results[0].driver + '</div>';
        output += '<div><b>User:</b> ' + results[0].user + '</div>';
        output += '<div><b>Booking Type:</b> ' + results[0].booking_type + '</div>';
        output += '<div><b>Start Location:</b> ' + results[0].start_location + '</div>';
        output += '<div><b>End Location:</b> ' + results[0].end_location + '</div>';
        output += '<div><b>Ride Purpose:</b> ' + results[0].ride_purpose + '</div>';

        res.send(output);
    }).catch(err => {
        console.error(err);
        res.send("Error fetching ride details.");
    });
});


        app.get("/roeride", function(req, res) {
            var sql = 'SELECT * FROM Rides';
            var output = '<table border="1px">';
            output += '<tr><th>Ride ID</th><th>Start Location</th><th>End Location</th><th>Ride Purpose</th><th>Booking Type</th></tr>';
        
            db.query(sql).then(results => {
                for (var row of results) {
                    output += '<tr>';
                    output += '<td><a href="./roeride/' + row.id + '">' + row.id + '</a></td>';
                    output += '<td>' + row.start_location + '</td>';
                    output += '<td>' + row.end_location + '</td>';
                    output += '<td>' + row.ride_purpose + '</td>';
                    output += '<td>' + row.booking_id + '</td>';
                    output += '</tr>';
                }
                output += '</table>';
                res.send(output);
            }).catch(error => {
                res.status(500).send("Database query failed: " + error.message);
            });
        });
        
// Task 1: Provide JSON output for all students
app.get("/students", async function(req, res) {
    try {
        const students = await db.query("SELECT * FROM Students");
        res.json(students);
    } catch (error) {
        console.error("Database query failed:", error);
        res.status(500).send("Error fetching students data.");
    }
});

// Task: Render the rides page using Pug (UPDATED)
app.get("/rides", async function (req, res) {
    try {
        const rides = await db.query("SELECT * FROM uni_rides");
        res.render("index", { rides }); // Send rides data to Pug template
    } catch (error) {
        console.error("Database query failed:", error);
        res.status(500).send("Error fetching rides data.");
    }
});

// Create a route for /goodbye
app.get("/goodbye", function(req, res) {
    res.send("Goodbye world!");
});

// Create a dynamic route for /hello/<name>
app.get("/hello/:name", function(req, res) {
    console.log(req.params);
    res.send("Hello " + req.params.name);
});

// Start server on port 3000
app.listen(3000, function(){
    console.log(`Server running at http://127.0.0.1:3000/`);
});