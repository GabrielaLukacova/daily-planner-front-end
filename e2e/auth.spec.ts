import { test, expect } from '@playwright/test'; 

// Define a test that covers both user registration and login
test('user can register and then log in successfully', async ({ page }) => {
  
  // Navigate to the auth page (login/register)
  await page.goto('http://localhost:5173/auth');


  // --- Registration ---

  // Switch to registration mode by clicking the "Create account" button
  await page.getByRole('button', { name: 'Create account' }).click();

  // Generate a unique email to avoid duplicate registration errors
  const uniqueEmail = `user${Date.now()}@example.com`;

  // Fill in the registration form
  await page.getByPlaceholder('Name').fill('Playwright Tester');
  await page.getByPlaceholder('Email').fill(uniqueEmail);
  await page.getByPlaceholder('Password').fill('test1234');

  // Submit the registration form
  await page.getByRole('button', { name: 'Register' }).click();

  // Verify that a success message appears after registration
  await expect(page.locator('text=Account successfully created')).toBeVisible();


  // --- Switch to login ---

  // Return to login mode
  await page.getByRole('button', { name: 'Login' }).click();


  // --- Login ---

  // Fill in the login form with the newly registered credentials
  await page.getByPlaceholder('Email').fill(uniqueEmail);
  await page.getByPlaceholder('Password').fill('test1234');

  // Submit the login form
  await page.getByRole('button', { name: 'Login' }).click();

  // Verify that the user is logged in by checking visible text on the landing page
  await expect(page.locator('text=My Day')).toBeVisible();
});
