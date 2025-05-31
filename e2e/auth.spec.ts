import { test, expect } from '@playwright/test';

test('user can register and then log in successfully', async ({ page }) => {
  await page.goto('http://localhost:5173/auth');

  // --- Registration ---
  await page.getByRole('button', { name: 'Create account' }).click();

  const uniqueEmail = `user${Date.now()}@example.com`;

  await page.getByPlaceholder('Name').fill('Playwright Tester');
  await page.getByPlaceholder('Email').fill(uniqueEmail);
  await page.getByPlaceholder('Password').fill('test1234');
  await page.getByRole('button', { name: 'Register' }).click();

  await expect(page.locator('text=Account successfully created')).toBeVisible();

  // --- Switch to login ---
  await page.getByRole('button', { name: 'Login' }).click();

  // --- Login ---
  await page.getByPlaceholder('Email').fill(uniqueEmail);
  await page.getByPlaceholder('Password').fill('test1234');
  await page.getByRole('button', { name: 'Login' }).click();

  // Expect something visible that confirms login worked
  await expect(page.locator('text=My Day')).toBeVisible();
});
