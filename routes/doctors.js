const express = require("express");
const router = express.Router();

// Middleware to make db accessible in routes
router.use((req, res, next) => {
    req.db = req.app.get('db'); // Get the db connection
    next();
});
// Route to display the edit form for a specific doctor
router.get("/edit/:id", function(req, res, next) {
    const doctorId = req.params.id;
    console.log('Edit doctor route accessed with ID:', doctorId); // Debugging line
    const query = "SELECT * FROM doctor WHERE Doctor_id = ?"; // Fetch specific doctor by ID

    req.db.query(query, [doctorId], function(error, data) {
        if (error) {
            console.error('Database query error:', error); // Log any database query errors
            return res.status(500).send('Server Error'); // Handle errors gracefully
        }

        if (data.length > 0) {
            res.render('editdoctor', {
                title: 'Edit Doctor', // Title for the edit page
                editdoctor: data[0] // Send the first (and only) doctor object
            });
        } else {
            console.log('Doctor not found'); // Log if the doctor is not found
            res.status(404).send('Doctor not found'); // Send 404 if doctor not found
        }
    });
});
// Route to handle updating doctor details
router.post("/update/:id", function(req, res, next) {
    const doctorId = req.params.id;
    const { name, email, phone, specialization, availability, start_time, end_time } = req.body;

    const query = `
        UPDATE doctor 
        SET Names = ?, email = ?, phone = ?, specialization = ?, availability = ?, start_time = ?, end_time = ? 
        WHERE Doctor_id = ?
    `;

    req.db.query(query, [name, email, phone, specialization, availability, start_time, end_time, doctorId], function(error) {
        if (error) {
            console.error('Update error:', error); // Log the error
            return res.status(500).send('Server Error'); // Handle errors gracefully
        }

        res.redirect("/doctor"); // Redirect back to the doctors list after updating
    });
});
// Route to delete a doctor (using DELETE)
router.delete("/delete/:id", (req, res) => {
    const doctorId = req.params.id;
    const query = "DELETE FROM doctor WHERE Doctor_id = ?";

    req.db.query(query, [doctorId], (error) => {
        if (error) {
            console.error("Deletion error:", error);
            return res.status(500).send("Server Error");
        }
        res.redirect("/doctor"); // Redirect back to the doctor list after deletion
    });
});

// Route to display the list of doctors
router.get("/", function(req, res, next) {
    const query = "SELECT * FROM Doctors ORDER BY Doctor_id DESC";

    req.db.query(query, function(error, data) {
        if (error) {
            throw error; // You may want to handle errors more gracefully
        } else {
            res.render('doctorslist', {
                title: 'Doctors List', // Set a title for the page
                action: 'list',
                doctorslist: data // Correct variable name here
            });
        }
    });
});

// Optionally, if you want a separate route to show the form for adding doctors
router.get("/add", (req, res) => {
    res.render("addDoctor", {
        title: 'Add Doctor',
        action: 'add'
    }); // Render a separate form for adding doctors
});
// Route to display the patient registration form
router.get("/register", (req, res) => {
    res.render("doctors"); // Render the doctors.ejs file
});
router.post("/create", async(req, res) => {
    const { Names, email, phone, specialization, availability, starttime, endtime } = req.body;

    // Check for required fields
    if (!Names || !email || !phone || !specialization || !availability || !starttime || !endtime) {
        return res.status(400).send("All fields are required ");
    }

    const db = req.db;

    try {

        // Insert doctors details into the database
        db.query(
            'INSERT INTO doctors (Names,email,phone,specialization,availability,start_time,end_time) VALUES (?, ?, ?, ?, ?, ?, ?)', [Names, email, phone, specialization, availability, starttime, endtime],
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
// Route to deactivate a doctor profile
router.post("/deactivate/:id", (req, res) => {
    const doctorId = req.params.id;

    const db = req.db;
    db.query(
        "UPDATE doctor SET status = 'Inactive' WHERE Doctor_id = ?", [doctorId],
        (err, result) => {
            if (err) {
                console.error("Error executing query:", err.stack);
                return res.status(500).send("Error deactivating doctor profile");
            }
            if (result.affectedRows === 0) {
                return res.status(404).send("Doctor not found");
            }
            res.send("Doctor profile deactivated successfully");
        }
    );
});


// Route to delete a doctor using DELETE
router.delete("/delete/:id", function(request, response) {
    var id = request.params.id;
    var query = "DELETE FROM doctor WHERE Doctor_id = ?"; // Ensure query is safe

    // Use req.db instead of db
    request.db.query(query, [id], function(error, data) {
        if (error) {
            console.error("Error deleting doctor:", error);
            return response.status(500).send("Server Error");
        }
        response.redirect("/doctor"); // Redirect back after successful deletion
    });
});

// Route to fetch upcoming appointments for a doctor
router.get('/doctor/appointments', async (req, res) => {
    const user = req.session.user;  // Assuming user info is stored in session
    
    if (!user) {
        return res.redirect('/login'); // Redirect to login if user is not logged in
    }

    const doctor_id = user.id;  // Get the doctor's id from session

    try {
        // Query to fetch upcoming appointments for the doctor
        const query = `
            SELECT a.appointment_id, a.appointment_date, a.appointment_time, 
                   p.first_name AS patient_name, p.last_name AS patient_last_name
            FROM appointments a
            JOIN patients p ON a.patient_id = p.id
            WHERE a.doctor_id = ? AND a.appointment_date >= CURDATE()
            ORDER BY a.appointment_date, a.appointment_time
        `;

        const [appointments] = await req.db.promise().query(query, [doctor_id]);

        // Render the appointments page and pass the appointments data
        res.render('doctor_appointments', { user, appointments });
    } catch (err) {
        console.error('Error fetching appointments:', err);
        res.status(500).send('Error fetching appointments');
    }
});

module.exports = router;