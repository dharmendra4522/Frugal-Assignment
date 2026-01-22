
const disposableDomains = ["tempmail.com", "mailinator.com"];

const countryStateCity = {
    "USA": {
        code: "+1",
        states: {
            "California": ["Los Angeles", "San Francisco", "San Diego"],
            "Texas": ["Houston", "Dallas", "Austin"],
            "New York": ["New York City", "Buffalo", "Rochester"]
        }
    },
    "India": {
        code: "+91",
        states: {
            "Maharashtra": ["Mumbai", "Pune", "Nagpur"],
            "Karnataka": ["Bangalore", "Mysore", "Mangalore"],
            "Delhi": ["New Delhi", "Dwarka", "Rohini"]
        }
    },
    "UK": {
        code: "+44",
        states: {
            "England": ["London", "Manchester", "Liverpool"],
            "Scotland": ["Edinburgh", "Glasgow", "Aberdeen"],
            "Wales": ["Cardiff", "Swansea", "Newport"]
        }
    }
};

const form = document.getElementById('registrationForm');
const submitBtn = document.getElementById('submitBtn');
const resetBtn = document.getElementById('resetBtn');
const bannerContainer = document.getElementById('banner-container');

// Populate country dropdown
const countrySelect = document.getElementById('country');
const stateSelect = document.getElementById('state');
const citySelect = document.getElementById('city');

function populateCountries() {
    Object.keys(countryStateCity).forEach(country => {
        const opt = document.createElement('option');
        opt.value = country;
        opt.textContent = country;
        countrySelect.appendChild(opt);
    });
}

function populateStates() {
    stateSelect.innerHTML = '<option value="">Select</option>';
    citySelect.innerHTML = '<option value="">Select</option>';
    const country = countrySelect.value;
    if (country && countryStateCity[country]) {
        Object.keys(countryStateCity[country].states).forEach(state => {
            const opt = document.createElement('option');
            opt.value = state;
            opt.textContent = state;
            stateSelect.appendChild(opt);
        });
    }
}

function populateCities() {
    citySelect.innerHTML = '<option value="">Select</option>';
    const country = countrySelect.value;
    const state = stateSelect.value;
    if (country && state && countryStateCity[country] && countryStateCity[country].states[state]) {
        countryStateCity[country].states[state].forEach(city => {
            const opt = document.createElement('option');
            opt.value = city;
            opt.textContent = city;
            citySelect.appendChild(opt);
        });
    }
}

countrySelect.addEventListener('change', () => {
    populateStates();
    validateField(countrySelect);
    validateField(document.getElementById('phone'));
});
stateSelect.addEventListener('change', () => {
    populateCities();
    validateField(stateSelect);
});
citySelect.addEventListener('change', () => {
    validateField(citySelect);
});

// Validation logic
function isEmailValid(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return false;
    const domain = email.split('@')[1].toLowerCase();
    return !disposableDomains.some(d => domain.endsWith(d));
}

function isPhoneValid(phone, country) {
    if (!phone) return false;
    if (!country || !countryStateCity[country]) return true;
    const code = countryStateCity[country].code;
    return phone.startsWith(code);
}

function getPasswordStrength(password) {
    if (!password) return {level: 0, text: ''};
    // Weak: <6 chars or only letters
    // Medium: >=6 chars, letters+numbers
    // Strong: >=8 chars, letters+numbers+special
    if (password.length < 6 || /^[a-zA-Z]+$/.test(password)) {
        return {level: 1, text: 'Weak'};
    }
    if (/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{6,}$/.test(password)) {
        return {level: 2, text: 'Medium'};
    }
    if (/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-={}\[\]:;"'<>,.?/]).{8,}$/.test(password)) {
        return {level: 3, text: 'Strong'};
    }
    return {level: 1, text: 'Weak'};
}

function validateField(field) {
    const id = field.id;
    let valid = true;
    let error = '';
    let value = field.value.trim();
    switch(id) {
        case 'firstName':
            if (!value) { valid = false; error = 'First Name is required.'; }
            break;
        case 'lastName':
            if (!value) { valid = false; error = 'Last Name is required.'; }
            break;
        case 'email':
            if (!value) { valid = false; error = 'Email is required.'; }
            else if (!isEmailValid(value)) { valid = false; error = 'Invalid or disposable email.'; }
            break;
        case 'phone':
            if (!value) { valid = false; error = 'Phone Number is required.'; }
            else if (!isPhoneValid(value, countrySelect.value)) { valid = false; error = 'Must start with valid country code.'; }
            break;
        case 'gender':
            if (!value) { valid = false; error = 'Gender is required.'; }
            break;
        case 'password':
            // No required, but show strength
            break;
        case 'confirmPassword':
            if (value !== document.getElementById('password').value) {
                valid = false; error = 'Passwords do not match.';
            }
            break;
        case 'terms':
            if (!field.checked) { valid = false; error = 'You must agree to Terms & Conditions.'; }
            break;
    }
    // UI update
    field.classList.remove('valid', 'invalid');
    if (valid && value) field.classList.add('valid');
    if (!valid) field.classList.add('invalid');
    const errorDiv = document.getElementById(id + '-error');
    if (errorDiv) errorDiv.textContent = error;
    return valid;
}

function validateForm(showBanner = false) {
    let valid = true;
    let errorFields = [];
    [
        'firstName', 'lastName', 'email', 'phone', 'gender', 'confirmPassword', 'terms'
    ].forEach(id => {
        const field = document.getElementById(id);
        const isValid = validateField(field);
        if (!isValid) {
            valid = false;
            errorFields.push(id);
        }
    });
    // Password strength
    const password = document.getElementById('password').value;
    const strength = getPasswordStrength(password);
    updateStrengthMeter(strength);
    // Enable/disable submit
    submitBtn.disabled = !valid;
    if (!valid && showBanner) {
        showBannerMsg('Please correct the highlighted errors.', 'error');
    }
    return valid;
}

function updateStrengthMeter(strength) {
    const bar = document.getElementById('strength-bar');
    const text = document.getElementById('strength-text');
    bar.className = 'strength-bar';
    if (strength.level === 1) bar.classList.add('strength-weak');
    if (strength.level === 2) bar.classList.add('strength-medium');
    if (strength.level === 3) bar.classList.add('strength-strong');
    text.textContent = strength.text;
}

function showBannerMsg(msg, type) {
    bannerContainer.innerHTML = '';
    const div = document.createElement('div');
    div.className = type === 'success' ? 'banner-success' : 'banner-error';
    div.textContent = msg;
    bannerContainer.appendChild(div);
    setTimeout(() => { div.remove(); }, 4000);
}

// Event listeners
form.addEventListener('input', e => {
    if (e.target.id === 'password') {
        updateStrengthMeter(getPasswordStrength(e.target.value));
        // Also revalidate confirm password
        validateField(document.getElementById('confirmPassword'));
    }
    validateField(e.target);
    validateForm();
});

form.addEventListener('change', e => {
    validateField(e.target);
    validateForm();
});

form.addEventListener('submit', e => {
    e.preventDefault();
    if (validateForm(true)) {
        showBannerMsg('Registration Successful!', 'success');
        form.reset();
        // Reset UI states
        Array.from(form.elements).forEach(el => {
            el.classList.remove('valid', 'invalid');
        });
        updateStrengthMeter({level: 0, text: ''});
        submitBtn.disabled = true;
    } else {
        showBannerMsg('Please correct the highlighted errors.', 'error');
    }
});

resetBtn.addEventListener('click', () => {
    Array.from(form.elements).forEach(el => {
        el.classList.remove('valid', 'invalid');
    });
    updateStrengthMeter({level: 0, text: ''});
    bannerContainer.innerHTML = '';
    submitBtn.disabled = true;
});

// Initial population
populateCountries();
