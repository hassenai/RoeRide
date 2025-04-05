// Import express.js
const express = require("express");
const path = require("path");

// Create express app
const app = express();

app.set('view engine', 'pug');
app.set('views', './app/views');

// Route to serve the index.pug file
app.get("/", (req, res) => {
    console.log("Rendering index.pug");
    res.render('index'); // Render the index.pug file from the views folder
});

// Start server on port 3000
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://127.0.0.1:${PORT}/`);
});

// To serve the static assets correctly
app.use(express.static(path.join(__dirname, 'views')));

// Route to render rides.pug
app.get("/rides", (req, res) => {
    res.render('rides');  // This will render rides.pug
});

// Route to render layout.pug
app.get("/layout", (req, res) => {
    res.render('layout');  // This will render layout.pug
});
