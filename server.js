// Import the necessary modules
const express = require("express");
const mysql = require("mysql2");
const dotenv = require("dotenv").config();
const cors = require("cors");
const path = require("path");
//import route  paths
const appointmentRoutes = require("./routes/appointment");
const patientRoutes = require("./routes/patients"); // Import patient routes
const loginRoutes = require("./routes/login"); // Import login routes
const mainRoutes = require("./routes/main"); // Import main form routes
const doctorsRoutes = require("./routes/doctors"); // Import main form routes
const homeRoute = require("./routes/home"); // Import home form routes

// Initialize Express app
const app = express();
const port = 991; // Port for the server
const session = require('express-session');

// Configure session middleware
app.use(session({
    secret: 'your-secret-key', // Ensure secret is passed here
    resave: false, // Don't save the session if it's not modified
    saveUninitialized: true, // Save uninitialized sessions
    cookie: { secure: false } // Set to 'true' for HTTPS, or leave 'false' for local development
}));
app.use((req, res, next) => {
    res.locals.user = req.session.user || null; // Set user as null if not logged in
    next();
});

// Middleware setup
app.use(express.static(path.join(__dirname, "public"))); // Serve static files from the public directory
app.set("view engine", "ejs"); // Set EJS as the template engine
app.set("views", path.join(__dirname, "views")); // Set the views directory for EJS templates
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // To parse URL-encoded bodies
app.use(cors());
//static file path
app.use(express.static("public"));
const methodOverride = require('method-override');
// Use method-override to support DELETE and PUT methods in forms
app.use(methodOverride('_method'));

// MySQL connection setup
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
});

// Connect to the database
db.connect((err) => {
    if (err) {
        console.error("Cannot connect to the database:", err.stack);
        process.exit(1);
    }
    console.log("Connected to the database");

    // Make the db accessible in routes
    app.set('db', db);

    // Launch server only after successful DB connection
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
});
// Use routes
app.use("/patients", patientRoutes); // Route group for all patient-related routes
app.use("/login", loginRoutes); // Route group for all login-related routes
app.use("/main", mainRoutes); // Route group for all home form routes
app.use("/doctor", doctorsRoutes);
app.use("/appointment", appointmentRoutes);
app.use("/home", homeRoute);

// Export the app for testing or further configurations if needed
module.exports = app;