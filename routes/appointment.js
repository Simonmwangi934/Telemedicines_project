const express = require('express');
const router = express.Router();

// Middleware to make db accessible in routes
router.use((req, res, next) => {
    req.db = req.app.get('db'); // Get the db connection from app.js
    next();
});


// POST route for booking an appointment
router.post('/', async(req, res) => {
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

// Route to handle updating appointments details
router.post("/update/:id", function(req, res, next) {
    const appointmentId = req.params.id;
    const { appointmentdate, appointmenttime } = req.body;

    const query = `
        UPDATE appointments
        SET appointment_date = ?, appointment_date = ?
        WHERE Appointments_id = ?
    `;

    req.db.query(query, [appointmentdate, appointmenttime], function(error) {
        if (error) {
            console.error('Update error:', error); // Log the error
            return res.status(500).send('Server Error'); // Handle errors gracefully
        }

        res.redirect("/appointments"); // Redirect back to the doctors list after updating
    });
});

// Route to deactivate a doctor profile
router.post("/deactivate/:id", (req, res) => {
    const appointmentId = req.params.id;

    const db = req.db;
    db.query(
        "UPDATE appointments SET status = 'Canceled' WHERE Appointments_id = ?", [appointmentId],
        (err, result) => {
            if (err) {
                console.error("Error executing query:", err.stack);
                return res.status(500).send("Error cancelling appointment");
            }
            if (result.affectedRows === 0) {
                return res.status(404).send("Appointment not found");
            }
            res.send("Appointment Cancelled");
        }
    );
});
// Route to display the list of doctors
router.get("/app", function(req, res, next) {
    const query = `
        SELECT 
            a.Appointments_id,
            d.first_name AS doctor_first_name,
            d.last_name AS doctor_last_name,
            d.specialization,
            p.first_name AS patient_first_name,
            p.last_name AS patient_last_name,
            p.email AS patient_email,
            a.appointment_date,
            a.appointment_time,
            a.status
        FROM appointments a
        JOIN doctors d ON a.Doctors_id = d.Doctors_id 
        JOIN patients p ON a.patient_id = p.patient_id 
        WHERE a.appointment_date > NOW()
        ORDER BY a.appointment_date ASC, a.appointment_time ASC;
    `;

    req.db.query(query, function(error, data) {
        if (error) {
            console.error('Error fetching appointments:', error);
            return res.status(500).send('Error retrieving appointments');
        } else {
            res.render('patients_appointments', {
                title: 'Appointments List', // Set a title for the page
                action: 'list',
                patients_appointments: data // Pass the fetched data to the template
            });
        }
    });
});

module.exports = router;