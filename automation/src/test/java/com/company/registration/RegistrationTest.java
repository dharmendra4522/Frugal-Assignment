package com.company.registration;

import org.openqa.selenium.*;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.Assert;
import org.testng.annotations.*;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.time.Duration;
import java.util.List;

public class RegistrationTest {
    private WebDriver driver;
    private WebDriverWait wait;
    private final String URL = "http://localhost:5500/registration/index.html";

    
    @BeforeClass
    public void setUp() {
        System.setProperty("webdriver.chrome.silentOutput", "true");
        driver = new ChromeDriver();
        wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        driver.manage().window().setSize(new Dimension(1200, 900));
    }

    @AfterClass
    public void tearDown() {
        if (driver != null) driver.quit();
    }

    // Utility: Take screenshot
    private void takeScreenshot(String fileName) {
        File src = ((TakesScreenshot) driver).getScreenshotAs(OutputType.FILE);
        try {
            Files.copy(src.toPath(), new File(fileName).toPath(), java.nio.file.StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            System.out.println("Screenshot failed: " + e.getMessage());
        }
    }

    // Utility: Fill field by id
    private void fillField(String id, String value) {
        WebElement el = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id(id)));
        el.clear();
        el.sendKeys(value);
    }

    // Utility: Select dropdown by visible text
    private void selectDropdown(String id, String value) {
        WebElement el = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id(id)));
        Select sel = new Select(el);
        sel.selectByVisibleText(value);
    }

    // Utility: Click element by id
    private void clickById(String id) {
        WebElement el = wait.until(ExpectedConditions.elementToBeClickable(By.id(id)));
        el.click();
    }

    // Utility: Wait for error message
    private String getErrorMessage(String id) {
        WebElement err = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id(id + "-error")));
        return err.getText();
    }

    // Utility: Wait for banner
    private String getBannerText() {
        WebElement banner = wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector("#banner-container > div")));
        return banner.getText();
    }

    // Utility: Get field border color
    private String getFieldBorderColor(String id) {
        WebElement el = driver.findElement(By.id(id));
        return el.getCssValue("border-color");
    }

    // Utility: Wait for submit enabled/disabled
    private boolean isSubmitEnabled() {
        WebElement btn = driver.findElement(By.id("submitBtn"));
        return btn.isEnabled();
    }

    @Test(priority = 1)
    public void negativeScenario_missingLastName() {
        driver.get(URL);
        System.out.println("Page URL: " + driver.getCurrentUrl());
        System.out.println("Page Title: " + driver.getTitle());
        fillField("firstName", "John");
        fillField("email", "john.doe@gmail.com");
        fillField("phone", "+1 5551234567");
        selectDropdown("gender", "Male");
        clickById("terms");
        // Instead of waiting for submitBtn to be clickable, trigger click via JS to fire validation
        ((JavascriptExecutor) driver).executeScript("document.getElementById('submitBtn').click();");
        String error = getErrorMessage("lastName");
        Assert.assertTrue(error.contains("Last Name is required"), "Error for Last Name missing");
        String border = getFieldBorderColor("lastName");
        Assert.assertTrue(border.equals("rgb(239, 68, 68)") || border.equals("#ef4444"), "Last Name field is red");
        takeScreenshot("error-state.png");
    }

    @Test(priority = 2)
    public void positiveScenario_successfulRegistration() {
        driver.get(URL);
        fillField("firstName", "Jane");
        fillField("lastName", "Smith");
        fillField("email", "jane.smith@gmail.com");
        fillField("phone", "+1 5559876543");
        fillField("age", "28");
        selectDropdown("gender", "Female");
        fillField("address", "123 Main St");
        selectDropdown("country", "USA");
        wait.until(ExpectedConditions.numberOfElementsToBeMoreThan(By.cssSelector("#state option"), 1));
        selectDropdown("state", "California");
        wait.until(ExpectedConditions.numberOfElementsToBeMoreThan(By.cssSelector("#city option"), 1));
        selectDropdown("city", "Los Angeles");
        fillField("password", "Jane@2026");
        fillField("confirmPassword", "Jane@2026");
        clickById("terms");
        wait.until(ExpectedConditions.elementToBeClickable(By.id("submitBtn")));
        clickById("submitBtn");
        String banner = getBannerText();
        Assert.assertTrue(banner.contains("Registration Successful"), "Success banner shown");
        // Check form reset
        Assert.assertEquals(driver.findElement(By.id("firstName")).getAttribute("value"), "");
        Assert.assertEquals(driver.findElement(By.id("lastName")).getAttribute("value"), "");
        takeScreenshot("success-state.png");
    }

    @Test(priority = 3)
    public void formLogicValidation() {
        driver.get(URL);
        // Country → State dynamic
        selectDropdown("country", "India");
        wait.until(ExpectedConditions.textToBePresentInElementLocated(By.id("state"), "Maharashtra"));
        selectDropdown("state", "Maharashtra");
        wait.until(ExpectedConditions.textToBePresentInElementLocated(By.id("city"), "Mumbai"));
        selectDropdown("city", "Mumbai");
        // Confirm Password mismatch
        fillField("password", "Test@2026");
        fillField("confirmPassword", "WrongPass");
        String confirmError = getErrorMessage("confirmPassword");
        Assert.assertTrue(confirmError.contains("Passwords do not match"), "Inline error for confirm password");
        // Submit button disabled
        Assert.assertFalse(isSubmitEnabled(), "Submit button remains disabled");
        // Fix confirm password
        fillField("confirmPassword", "Test@2026");
        // Fill required fields
        fillField("firstName", "Test");
        fillField("lastName", "User");
        fillField("email", "test.user@gmail.com");
        fillField("phone", "+91 9876543210");
        selectDropdown("gender", "Other");
        clickById("terms");
        wait.until(ExpectedConditions.elementToBeClickable(By.id("submitBtn")));
        Assert.assertTrue(isSubmitEnabled(), "Submit button enabled after all validations");
    }
}
