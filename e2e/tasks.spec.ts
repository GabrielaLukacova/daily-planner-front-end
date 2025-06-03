import { test, expect } from '@playwright/test';

test('user can create and complete a task', async ({ page }) => {
  // Navigate to auth page and register a new user
  await page.goto('http://localhost:5173/auth');
  await page.getByRole('button', { name: 'Create account' }).click();

  const email = `taskUser${Date.now()}@example.com`;

  await page.getByPlaceholder('Name').fill('Task Tester');
  await page.getByPlaceholder('Email').fill(email);
  await page.getByPlaceholder('Password').fill('test1234');
  await page.getByRole('button', { name: 'Register' }).click();

  await expect(page.locator('text=Account successfully created')).toBeVisible();

  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByPlaceholder('Email').fill(email);
  await page.getByPlaceholder('Password').fill('test1234');
  await page.getByRole('button', { name: 'Login' }).click();

  // Go to the task list page
  await page.getByRole('link', { name: 'To-do list' }).click(); // Adjust selector if needed

  // Add a new task
  await page.getByPlaceholder('What do you need to do?').fill('Write E2E test');
  await page.getByRole('button', { name: '+' }).click();

  // Verify that the task appears
  await expect(page.locator('text=Write E2E test')).toBeVisible();

  // Click the checkbox to complete the task
  await page.locator('input[type=checkbox]').first().check();

  // Optional: verify some style/class indicating it's done
  await expect(page.locator('.done')).toContainText('Write E2E test');
});
