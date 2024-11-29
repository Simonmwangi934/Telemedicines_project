const express = require("express");
const router = express.Router();

// Middleware to make db accessible in routes
router.use((req, res, next) => {
    req.db = req.app.get('db'); // Get the db connection from app.js
    next();
});

// home route (GET)
router.get("/", (req, res) => {
    res.render("home"); // Render the home.ejs file
});

module.exports = router;