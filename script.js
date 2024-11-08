function validateform() {
    let valid = true;

    // Get form values
    const name = document.getElementById("register-name");
    const email = document.getElementById("register-email");
    const phone = document.getElementById("register-phone");
    const gender = document.querySelector('input[name="gender"]:checked');
    const country = document.getElementById("register-country");
    const password = document.getElementById("register-password");
    const confirmPassword = document.getElementById("register-confirmpassword");

    // Reset previous errors and icons
    clearValidation(name, "nameIcon", "nameError");
    clearValidation(email, "emailIcon", "emailError");
    clearValidation(age, "phoneIcon", "phoneError");
    document.getElementById("genderError").innerHTML = "";
    clearValidation(country, "countryIcon", "countryError");
    clearValidation(password, "passwordIcon", "passwordError");
    clearValidation(confirmPassword, "confirmIcon", "confirmError");

    // Name validation
    if (name.value === "") {
        setInvalid(name, "nameIcon", "nameError", "Name is required");
        valid = false;
    } else {
        setValid(name, "nameIcon");
    }

    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email.value === "") {
        setInvalid(email, "emailIcon", "emailError", "Email is required");
        valid = false;
    } else if (!emailPattern.test(email.value)) {
        setInvalid(email, "emailIcon", "emailError", "Invalid email format");
        valid = false;
    } else {
        setValid(email, "emailIcon");
    }

    // Age validation
    if (age.value === "") {
        setInvalid(age, "ageIcon", "ageError", "Age is required");
        valid = false;
    } else if (age.value < 18 || age.value > 100) {
        setInvalid(age, "ageIcon", "ageError", "Age must be between 18 and 100");
        valid = false;
    } else {
        setValid(age, "ageIcon");
    }
    if (age.value === "") {
        setInvalid(age, "ageIcon", "ageError", "Age is required");
        valid = false;
    } else if (age.value < 18 || age.value > 100) {
        setInvalid(age, "ageIcon", "ageError", "Age must be between 18 and 100");
        valid = false;
    } else {
        setValid(age, "ageIcon");
    }

    // Gender validation
    if (!gender) {
        document.getElementById("genderError").innerHTML = "Gender is required";
        valid = false;
    }

    // Country validation
    if (country.value === "Select") {
        setInvalid(country, "countryIcon", "countryError", "Please select a country");
        valid = false;
    } else {
        setValid(country, "countryIcon");
    }

    // Password validation
    if (password.value === "") {
        setInvalid(password, "passwordIcon", "passwordError", "Password is required");
        valid = false;
    } else if (password.value.length < 6) {
        setInvalid(password, "passwordIcon", "passwordError", "Password must be at least 6 characters");
        valid = false;
    } else {
        setValid(password, "passwordIcon");
    }

    // Confirm password validation
    if (confirmPassword.value === "") {
        setInvalid(confirmPassword, "confirmIcon", "confirmError", "Please confirm your password");
        valid = false;
    } else if (password.value !== confirmPassword.value) {
        setInvalid(confirmPassword, "confirmIcon", "confirmError", "Passwords do not match");
        valid = false;
    } else {
        setValid(confirmPassword, "confirmIcon");
    }

    return valid;
}

function setValid(inputElement, iconId) {
    inputElement.classList.remove("invalid");
    inputElement.classList.add("valid");
    document.getElementById(iconId).classList.remove("fa-times");
    document.getElementById(iconId).classList.add("fa-check");
}

function setInvalid(inputElement, iconId, errorId, message) {
    inputElement.classList.remove("valid");
    inputElement.classList.add("invalid");
    document.getElementById(errorId).innerHTML = message;
    document.getElementById(iconId).classList.remove("fa-check");
    document.getElementById(iconId).classList.add("fa-times");
}

function clearValidation(inputElement, iconId, errorId) {
    inputElement.classList.remove("valid", "invalid");
    document.getElementById(iconId).classList.remove("fa-check", "fa-times");
    document.getElementById(errorId).innerHTML = "";
}
//login validation
function validateforms() {
    let valid = true;

    // Get form values
    const email = document.getElementById("register-email");
    const password = document.getElementById("register-password");

    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email.value === "") {
        setInvalid(email, "emailIcon", "emailError", "Email is required");
        valid = false;
    } else if (!emailPattern.test(email.value)) {
        setInvalid(email, "emailIcon", "emailError", "Invalid email format");
        valid = false;
    } else {
        setValid(email, "emailIcon");
    }

    // Password validation
    if (password.value === "") {
        setInvalid(password, "passwordIcon", "passwordError", "Password is required");
        valid = false;
    } else if (password.value.length < 6) {
        setInvalid(password, "passwordIcon", "passwordError", "Password must be at least 6 characters");
        valid = false;
    } else {
        setValid(password, "passwordIcon");
    }

    return valid;
}

function setValid(inputElement, iconId) {
    inputElement.classList.remove("invalid");
    inputElement.classList.add("valid");
    document.getElementById(iconId).classList.remove("fa-times");
    document.getElementById(iconId).classList.add("fa-check");
}

function setInvalid(inputElement, iconId, errorId, message) {
    inputElement.classList.remove("valid");
    inputElement.classList.add("invalid");
    document.getElementById(errorId).innerHTML = message;
    document.getElementById(iconId).classList.remove("fa-check");
    document.getElementById(iconId).classList.add("fa-times");
}

function clearValidation(inputElement, iconId, errorId) {
    inputElement.classList.remove("valid", "invalid");
    document.getElementById(iconId).classList.remove("fa-check", "fa-times");
    document.getElementById(errorId).innerHTML = "";
}