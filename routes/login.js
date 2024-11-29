const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();

// Middleware to make db accessible in routes
router.use((req, res, next) => {
    req.db = req.app.get('db'); // Get the db connection from app.js
    next();
});

// GET route to render the login form
router.get('/', (req, res) => {
    res.render('login'); // Renders login.ejs in the views directory
});

// POST route for login credentials
router.post('/credentials', async(req, res) => {
    const { email, password } = req.body;

    try {
        // Query to check if a user with the given email exists
        const query = 'SELECT * FROM patients WHERE email = ?';
        req.db.query(query, [email], async(err, results) => {
            if (err) {
                console.error('Error executing query:', err.stack);
                return res.status(500).send('Server error');
            }

            // Check if a user was found with the provided email
            if (results.length === 0) {
                return res.status(401).send('Invalid email or password');
            }

            const user = results[0]; // Get the user data

            // Compare provided password with stored hashed password
            const isMatch = await bcrypt.compare(password, user.password_hash);
            if (isMatch) {
                // Set user session with id, first name, last name, and email
                req.session.user = {
                    id: user.id,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email
                };
                return res.redirect('/main/main'); // Redirect to the main dashboard
            } else {
                // If password doesn't match
                return res.status(401).send('Invalid email or password');
            }

        });
    } catch (error) {
        console.error('Error during login process:', error);
        res.status(500).send('Internal server error');
    }
});
//logout
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error during logout:', err);
            return res.status(500).send('Logout failed');
        }
        res.redirect('/'); // Redirect to login page after logout
    });
});

module.exports = router;