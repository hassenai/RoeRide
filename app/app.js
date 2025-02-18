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
        res.send(results);
    });
});

// Task 1: Provide JSON output for all students
app.get("/students", async function(req, res) {
    try {
        const students = await db.query("SELECT * FROM Students");
        res.json(students); // Send the students as JSON response
    } catch (error) {
        console.error("Database query failed:", error);
        res.status(500).send("Error fetching students data.");
    }
});

// Task 2: Provide HTML formatted output for all students
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

// Task 3: Provide JSON output of all programmes
app.get("/programmes", async function(req, res) {
    try {
        const programmes = await db.query("SELECT * FROM Programmes");
        res.json(programmes); // Send the programmes as JSON response
    } catch (error) {
        console.error(error);
        res.status(500).send("Error fetching programmes data.");
    }
});

// Task 4: Provide HTML formatted output of all programmes
app.get("/programmes", async function(req, res) {
    try {
        const programmes = await db.query("SELECT * FROM Programmes");
        let html = `
            <h1>List of Programmes</h1>
            <table border="1">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                    </tr>
                </thead>
                <tbody>`;
        
        programmes.forEach(programme => {
            html += `
                <tr>
                    <td>${programme.id}</td>
                    <td><a href="/programmes/${programme.id}">${programme.name}</a></td>
                </tr>`;
        });
        
        html += `</tbody></table>`;
        res.send(html); // Send the HTML table
    } catch (error) {
        console.error(error);
        res.status(500).send("Error fetching programmes data.");
    }
});

// Task 5: Create a single-programme page with associated modules
app.get("/programmes/:id", async function(req, res) {
    try {
        const programme = await db.query("SELECT * FROM Programmes WHERE id = ?", [req.params.id]);
        const modules = await db.query("SELECT m.name FROM Modules m JOIN Programme_Modules pm ON m.code = pm.module WHERE pm.programme = ?", [req.params.id]);

        if (programme.length === 0) {
            res.status(404).send("Programme not found");
            return;
        }

        let html = `<h1>Programme: ${programme[0].name}</h1>`;
        html += `<h2>Modules:</h2><ul>`;
        
        modules.forEach(module => {
            html += `<li>${module.name}</li>`;
        });
        
        html += `</ul>`;
        res.send(html); // Send the programme details along with its modules
    } catch (error) {
        console.error(error);
        res.status(500).send("Error fetching programme data.");
    }
});

// Create a route for /goodbye
app.get("/goodbye", function(req, res) {
    res.send("Goodbye world!");
});

// Create a dynamic route for /hello/<name>, where name is any value provided by user
app.get("/hello/:name", function(req, res) {
    console.log(req.params);
    res.send("Hello " + req.params.name);
});

// Start server on port 3000
app.listen(3000, function(){
    console.log(`Server running at http://127.0.0.1:3000/`);
});

const express = require("express");
const app = express();

// Use the Pug templating engine
app.set('view engine', 'pug');
app.set('views', './app/views');

app.get("/", function(req, res) {
    res.render("index", { 'title': 'My index page', 'heading': 'My heading' });
});
