const express = require("express");
const router = express.Router();

// Middleware to make db accessible in routes
router.use((req, res, next) => {
    req.db = req.app.get('db'); // Get the db connection from app.js
    next();
});

// Main route (GET)
router.get('/main', (req, res) => {
    if (req.session.user) { // Check if the user is logged in
        res.render('main', { user: req.session.user }); // Render main page with user data
    } else {
        res.redirect('/login'); // Redirect to login if no user is logged in
    }
});

module.exports = router;
