const express = require("express");
const bcrypt = require("bcrypt"); // Import bcrypt
const router = express.Router();

// Middleware to make db accessible in routes
router.use((req, res, next) => {
    req.db = req.app.get('db'); // Get the db connection
    next();
});


// Route to display the patient registration form
router.get("/register", (req, res) => {
    res.render("patients"); // Render the patients.ejs file
});
router.get("/", (req, res) => {
    res.render("patients_appointments"); // Render the patients.ejs file
});
router.post("/create", async(req, res) => {
    const { first_name, last_name, email, date_of_birth, phone, gender, address, password, confirm_password } = req.body;

    // Check for missing fields
    if (!first_name || !last_name || !email || !date_of_birth || !phone || !gender || !address || !password) {
        return res.status(400).send('All fields are required');
    }

    // Check if passwords match
    if (password !== confirm_password) {
        return res.status(400).send('Passwords do not match');
    }

    const db = req.db;

    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Insert into the database
        db.query(
            'INSERT INTO patients (first_name, last_name, email, date_of_birth, phone, gender, address, password_hash) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [first_name, last_name, email, date_of_birth, phone, gender, address, hashedPassword], // Use hashedPassword instead of password
            (err, result) => {
                if (err) {
                    console.error('Error executing query: ', err.stack);
                    res.status(400).send('Error creating user: ' + err.message); // Return error message
                    return;
                }
                res.status(201).send('User created successfully'); // Success response
            }
        );
    } catch (error) {
        console.error('Error hashing password: ', error);
        res.status(500).send('Internal server error');
        return;
    }
});

// Route to view the profile (GET)
router.get('/profile', (req, res) => {
    // Check if the user is logged in
    if (!req.session.user) {
        return res.redirect('/login'); // Redirect to login if not logged in
    }

    const patientId = req.session.user.id; // Get logged-in patient's ID from session

    // Query the database to get the patient's information
    const query = 'SELECT * FROM patients WHERE id = ?';
    req.db.query(query, [patientId], (err, results) => {
        if (err) {
            console.error('Error fetching patient data:', err);
            return res.status(500).send('Server error');
        }

        if (results.length > 0) {
            const patient = results[0]; // Get the patient details

            // Render the editpatient.ejs template with patient data
            res.render('editpatient', {
                title: 'Edit Profile',
                editpatient: patient
            });
        } else {
            return res.status(404).send('Patient not found');
        }
    });
});
// Route to view upcoming appointments
router.get('/patients/appointments', async(req, res) => {
    const user = req.session.user; // Get user from session
    if (!user) {
        return res.redirect('/login'); // Redirect to login if user is not logged in
    }

    const patient_id = user.id;

    try {
        // Query to fetch upcoming appointments for this patient
        const query = `
            SELECT a.appointment_date, a.appointment_time, d.name AS doctor_name, d.specialty
            FROM appointments a
            JOIN doctors d ON a.doctor_id = d.id
            WHERE a.patient_id = ? AND a.appointment_date >= CURDATE()  -- Show only future appointments
            ORDER BY a.appointment_date, a.appointment_time
        `;
        const [appointments] = await req.db.promise().query(query, [patient_id]);

        // Render the appointments page and pass the appointments data
        res.render('patients_appointments', { appointments });
    } catch (err) {
        console.error('Error fetching appointments:', err);
        res.status(500).send('Error fetching appointments');
    }
});

// Admin route (GET) – assuming only admins can access
router.get("/admin", (req, res) => {
    res.render("admin"); // Render the admin.ejs file
});
// Route to display the list of patients
router.get("/lists", function(req, res, next) {
    const query = "SELECT * FROM  patients ORDER BY patient_id DESC";

    req.db.query(query, function(error, data) {
        if (error) {
            throw error; // You may want to handle errors more gracefully
        } else {
            res.render('patients_list', {
                title: 'Patients List', // Set a title for the page
                action: 'list',
                patients_list: data // Correct variable name here
            });
        }
    });
});

module.exports = router;