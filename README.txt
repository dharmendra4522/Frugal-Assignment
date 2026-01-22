# Intelligent Registration System – Automation Project

## Project Overview

This project implements an end-to-end Intelligent Registration System with strong client-side validations and complete UI automation testing.

The objective of the project is to:
- Build a responsive registration form using HTML, CSS, and JavaScript.
- Implement robust client-side validations for mandatory fields and business rules.
- Automate the complete registration workflow using Java and Selenium WebDriver.
- Validate negative, positive, and dynamic form logic scenarios through automation.

This project was developed as part of the Frugal Testing Software Engineer assignment.

---

## Technologies Used

Frontend:
- HTML5
- CSS3
- JavaScript

Automation:
- Java
- Selenium WebDriver
- TestNG
- Maven

Tools:
- Google Chrome
- ChromeDriver

---

## Project Structure

registration/
├── index.html
├── style.css
└── script.js

automation/
├── pom.xml
└── src/test/java/.../RegistrationTest.java

screenshots/
├── form-loaded.png
├── validation-error.png
├── error-state.png
└── success-state.png


---

## Test Scenarios Covered

The following automation flows are implemented:

### Flow A – Negative Scenario
- Launch the registration page.
- Fill all required fields except Last Name.
- Submit the form.
- Verify error message for missing Last Name.
- Verify field highlight.
- Capture screenshot: `error-state.png`.

### Flow B – Positive Scenario
- Fill all fields with valid data.
- Match Password and Confirm Password.
- Check Terms & Conditions.
- Submit the form.
- Verify success message.
- Verify form reset.
- Capture screenshot: `success-state.png`.

### Flow C – Form Logic Validation
- Verify Country → State dynamic update.
- Verify State → City dynamic update.
- Verify password strength validation.
- Verify confirm password mismatch handling.
- Verify submit button remains disabled until form is valid.

---

## Prerequisites

- Java 11 or above
- Maven
- Google Chrome browser
- ChromeDriver available in system PATH

---

## How to Run the Web Application

1. Navigate to the `registration` folder.
2. Open `index.html` using Live Server or any local web server.
3. Ensure the application is accessible at:

   http://localhost:5500/registration/index.html

---

## How to Run Automation Tests

1. Open a terminal in the `automation` folder.
2. Run the following command:

   mvn clean test

3. The following will happen:
   - Chrome browser will launch automatically.
   - Automation Flow A, B, and C will execute.
   - Test results will be printed in the console.

4. After execution:
   - Screenshots will be available in the `screenshots` folder.
   - Detailed test reports will be available in:

     automation/target/surefire-reports

---

## Execution Evidence

- Automation execution video is available at:
  https://drive.google.com/file/d/1AKAzoSv-d5hKOVJGRG5JwJPYpiHteEzD/view?usp=sharing

- Screenshots included:
  - form-loaded.png
  - validation-error.png
  - error-state.png
  - success-state.png

---

## Notes

- Do not rename input field IDs, as automation depends on them.
- Do not commit the `target/` folder to the repository.
- Ensure ChromeDriver version is compatible with your Chrome browser.

---

## Author

Dharmendra Vishvkarma
College - Ajay Kumar Garg Engineering College Ghaziabad
Roll Number - 2300270139006
