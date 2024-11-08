const express = require('express');
const router = express.Router();

// Middleware to make db accessible in routes
router.use((req, res, next) => {
    req.db = req.app.get('db'); // Get the db connection from app.js
    next();
});

// GET route to render the appointment form
router.get('/', async (req, res) => {
    const user = req.session.user;  // Assuming user info is stored in session
    if (!user) {
        return res.redirect('/login'); // Redirect to login if user is not logged in
    }

    try {
        // Fetch the list of doctors from the database
        const query = 'SELECT Doctor_id, Names, specialization FROM doctors';
        const [doctors] = await req.db.promise().query(query);

        // Render the appointment form and pass user and doctors data
        res.render('appointment', { user, doctors });
    } catch (err) {
        console.error('Error fetching doctors:', err);
        res.status(500).send('Error fetching doctors');
    }
});

// POST route for booking an appointment
router.post('/', async (req, res) => {
    const { patient_id, doctor_id, appointment_date, appointment_time } = req.body;

    try {
        // Query to insert the new appointment into the database
        const query = `
            INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time)
            VALUES (?, ?, ?, ?)
        `;
        const values = [patient_id, doctor_id, appointment_date, appointment_time];

        // Execute the query to add the appointment
        await req.db.promise().query(query, values);

        // Redirect the user to the appointments page
        res.redirect('/patients/appointments');  
    } catch (err) {
        console.error('Error booking appointment:', err);
        res.status(500).send('Error booking appointment');
    }
});



module.exports = router;
