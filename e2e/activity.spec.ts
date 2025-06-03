import { test, expect } from '@playwright/test';

// This test registers a new user, logs in, and adds a new activity
test('user can add a new activity to their day plan', async ({ page }) => {
  // Go to the authentication page
  await page.goto('http://localhost:5173/auth');

  // Click the "Create account" button to switch to the registration form
  await page.getByRole('button', { name: 'Create account' }).click();

  // Generate a unique email to avoid duplicates
  const uniqueEmail = `activityUser${Date.now()}@example.com`;

  // Fill out the registration form
  await page.getByPlaceholder('Name').fill('Activity Tester');
  await page.getByPlaceholder('Email').fill(uniqueEmail);
  await page.getByPlaceholder('Password').fill('test1234');
  await page.getByRole('button', { name: 'Register' }).click();

  // Confirm that account was created successfully
  await expect(page.locator('text=Account successfully created')).toBeVisible();

  // Switch back to login form
  await page.getByRole('button', { name: 'Login' }).click();

  // Log in with the same credentials
  await page.getByPlaceholder('Email').fill(uniqueEmail);
  await page.getByPlaceholder('Password').fill('test1234');
  await page.getByRole('button', { name: 'Login' }).click();

  // Check that the main dashboard is visible
  await expect(page.locator('text=My Day')).toBeVisible();

  // Click the "+" button to open the activity form
  await page.getByRole('button', { name: '+' }).click();

  // Fill in the activity form
  await page.getByPlaceholder('Activity title').fill('Playwright Test Activity');
  await page.getByPlaceholder('Start time').fill('10:00');
  await page.getByPlaceholder('End time').fill('11:00');

  // Submit the activity form
  await page.getByRole('button', { name: 'Save' }).click();

  // Verify that the new activity appears in the list
  await expect(page.locator('text=Playwright Test Activity')).toBeVisible();
});

