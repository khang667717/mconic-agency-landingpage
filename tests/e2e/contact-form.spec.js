const { test, expect } = require('@playwright/test');

test.describe('Contact Form', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Scroll to contact form
    await page.locator('#contact').scrollIntoViewIfNeeded();
  });

  test('should submit valid contact form', async ({ page }) => {
    // Fill form fields
    await page.fill('input[name="name"]', 'Nguyễn Văn A');
    await page.fill('input[name="phone"]', '0901234567');
    await page.fill('input[name="email"]', 'contact@company.com');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Check for success message
    const successMsg = page.locator('.success-message');
    await expect(successMsg).toBeVisible({ timeout: 5000 });
    await expect(successMsg).toContainText('thành công');
  });

  test('should show error for invalid phone', async ({ page }) => {
    await page.fill('input[name="name"]', 'John Doe');
    await page.fill('input[name="phone"]', '123'); // Invalid: too short
    await page.fill('input[name="email"]', 'john@example.com');
    
    await page.click('button[type="submit"]');
    
    const errorMsg = page.locator('#cPhoneErr');
    await expect(errorMsg).toBeVisible();
    await expect(errorMsg).toContainText('không hợp lệ');
  });

  test('should show error for invalid email', async ({ page }) => {
    await page.fill('input[name="name"]', 'John Doe');
    await page.fill('input[name="phone"]', '0901234567');
    await page.fill('input[name="email"]', 'invalid-email'); // Invalid: no @
    
    await page.click('button[type="submit"]');
    
    const errorMsg = page.locator('#cEmailErr');
    await expect(errorMsg).toBeVisible();
  });

  test('should show error for missing required fields', async ({ page }) => {
    // Leave name empty
    await page.fill('input[name="phone"]', '0901234567');
    await page.fill('input[name="email"]', 'john@example.com');
    
    await page.click('button[type="submit"]');
    
    const nameErrorMsg = page.locator('#cNameErr');
    await expect(nameErrorMsg).toBeVisible();
  });

  test('should accept phone with spaces', async ({ page }) => {
    await page.fill('input[name="name"]', 'John Doe');
    await page.fill('input[name="phone"]', '0901 234 567'); // With spaces
    await page.fill('input[name="email"]', 'john@example.com');
    
    await page.click('button[type="submit"]');
    
    const successMsg = page.locator('.success-message');
    await expect(successMsg).toBeVisible({ timeout: 5000 });
  });

  test('should accept phone with hyphens', async ({ page }) => {
    await page.fill('input[name="name"]', 'John Doe');
    await page.fill('input[name="phone"]', '090-123-4567'); // With hyphens
    await page.fill('input[name="email"]', 'john@example.com');
    
    await page.click('button[type="submit"]');
    
    const successMsg = page.locator('.success-message');
    await expect(successMsg).toBeVisible({ timeout: 5000 });
  });

  test('should reset form after successful submission', async ({ page }) => {
    await page.fill('input[name="name"]', 'John Doe');
    await page.fill('input[name="phone"]', '0901234567');
    await page.fill('input[name="email"]', 'john@example.com');
    
    await page.click('button[type="submit"]');
    
    // Wait for success
    await page.locator('.success-message').waitFor({ state: 'visible', timeout: 5000 });
    
    // Check fields are cleared
    const nameInput = page.locator('input[name="name"]');
    await expect(nameInput).toHaveValue('');
  });

  test('should be accessible via keyboard', async ({ page }) => {
    // Tab through form fields
    await page.keyboard.press('Tab'); // Focus first input (name)
    await page.keyboard.type('John Doe');
    
    await page.keyboard.press('Tab'); // Focus phone
    await page.keyboard.type('0901234567');
    
    await page.keyboard.press('Tab'); // Focus email
    await page.keyboard.type('john@example.com');
    
    await page.keyboard.press('Tab'); // Focus submit button
    await page.keyboard.press('Enter'); // Submit
    
    const successMsg = page.locator('.success-message');
    await expect(successMsg).toBeVisible({ timeout: 5000 });
  });
});
