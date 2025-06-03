import { test, expect } from '@playwright/test';

test('user can write and save a note', async ({ page }) => {
  await page.goto('http://localhost:5173/auth');
  await page.getByRole('button', { name: 'Create account' }).click();

  const email = `noteUser${Date.now()}@example.com`;

  await page.getByPlaceholder('Name').fill('Note Tester');
  await page.getByPlaceholder('Email').fill(email);
  await page.getByPlaceholder('Password').fill('test1234');
  await page.getByRole('button', { name: 'Register' }).click();

  await expect(page.locator('text=Account successfully created')).toBeVisible();

  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByPlaceholder('Email').fill(email);
  await page.getByPlaceholder('Password').fill('test1234');
  await page.getByRole('button', { name: 'Login' }).click();

  // Go to the notes page
  await page.getByRole('link', { name: 'Notes' }).click(); // Adjust if you use icons/text

  // Type in the editor
  const noteText = 'This is a test note using Playwright';
  await page.locator('[contenteditable]').fill(noteText);

  // Click the Save button
  await page.getByRole('button', { name: 'Save' }).click();

  // Confirm success message
  await expect(page.locator('text=Note saved')).toBeVisible();

  // Optionally check if the note is still present
  await expect(page.locator('[contenteditable]')).toContainText('Playwright');
});
