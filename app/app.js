// Import express.js
const express = require("express");

// Create express app
var app = express();

// Add static files location
app.use(express.static("static"));

// Get the functions in the db.js file to use
const db = require('./services/db');

// Create a route for root - /
app.get("/", function(req, res) {
    res.send("Hello world!");
});

// Create a route for testing the db
app.get("/db_test", function(req, res) {
    // Assumes a table called test_table exists in your database
    sql = 'select * from test_table';
    db.query(sql).then(results => {
        console.log(results);
        res.send(results)
    });
});

app.get("/students", async function(req, res) {
    try {
        const students = await db.query("SELECT * FROM Students");
        res.json(students); // Send the students as JSON response
    } catch (error) {
        console.error("Database query failed:", error); // Log the error
        res.status(500).send("Error fetching students data.");
    }
});

// Add route for displaying students in an HTML table
app.get("/students", async function(req, res) {
    try {
        const students = await db.query("SELECT * FROM Students");
        let html = `
            <h1>List of Students</h1>
            <table border="1">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                    </tr>
                </thead>
                <tbody>`;
        
        students.forEach(student => {
            html += `
                <tr>
                    <td>${student.id}</td>
                    <td><a href="/students/${student.id}">${student.name}</a></td>
                </tr>`;
        });
        
        html += `</tbody></table>`;
        res.send(html); // Send the HTML table
    } catch (error) {
        console.error(error);
        res.status(500).send("Error fetching students data.");
    }
});

// Create a route for /goodbye
// Responds to a 'GET' request
app.get("/goodbye", function(req, res) {
    res.send("Goodbye world!");
});

// Create a dynamic route for /hello/<name>, where name is any value provided by user
// At the end of the URL
// Responds to a 'GET' request
app.get("/hello/:name", function(req, res) {
    // req.params contains any parameters in the request
    // We can examine it in the console for debugging purposes
    console.log(req.params);
    //  Retrieve the 'name' parameter and use it in a dynamically generated page
    res.send("Hello " + req.params.name);
});

// Start server on port 3000
app.listen(3000,function(){
    console.log(`Server running at http://127.0.0.1:3000/`);
});
