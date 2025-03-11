// Import express.js
const express = require("express");

// Create express app
var app = express();

// Add static files location
app.use(express.static("static"));

// Use the Pug templating engine
app.set('view engine', 'pug');
app.set('views', './app/views');

// Get the functions in the db.js file to use
const db = require('./services/db');

// Create a route for root - /
app.get("/", function(req, res) {
    res.send("Hello world!");
});

// Create a route for testing the db
app.get("/db_test", function(req, res) {
    sql = 'SELECT * FROM test_table';
    db.query(sql).then(results => {
        console.log(results);
        res.send(results);
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