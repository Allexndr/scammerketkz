import { test, expect } from '@playwright/test'

test.describe('Report Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/report')
  })

  test('displays report form in Russian', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Сообщить о мошеннике')
    await expect(page.locator('text=Помогите другим пользователям')).toBeVisible()

    // Check form fields
    await expect(page.locator('input[placeholder*="номер телефона"]')).toBeVisible()
    await expect(page.locator('select[label*="Пол мошенника"]')).toBeVisible()
    await expect(page.locator('input[placeholder*="Kaspi Bank"]')).toBeVisible()
    await expect(page.locator('textarea[placeholder*="Опишите"]')).toBeVisible()

    // Check submit button
    await expect(page.locator('button:has-text("Отправить отчет")')).toBeVisible()
  })

  test('displays report form in Kazakh', async ({ page }) => {
    await page.goto('http://localhost:3000/kk/report')

    await expect(page.locator('h1')).toContainText('Алаяқ туралы хабарлау')
    await expect(page.locator('text=Басқа пайдаланушыларға')).toBeVisible()

    // Check form fields in Kazakh
    await expect(page.locator('input[placeholder*="телефон нөмірі"]')).toBeVisible()
    await expect(page.locator('button:has-text("Есепті жіберу")')).toBeVisible()
  })

  test('displays report form in English', async ({ page }) => {
    await page.goto('http://localhost:3000/en/report')

    await expect(page.locator('h1')).toContainText('Report a scammer')
    await expect(page.locator('text=Help other users')).toBeVisible()

    // Check form fields in English
    await expect(page.locator('input[placeholder*="phone number"]')).toBeVisible()
    await expect(page.locator('button:has-text("Submit report")')).toBeVisible()
  })

  test('validates required fields', async ({ page }) => {
    // Try to submit empty form
    await page.locator('button:has-text("Отправить отчет")').click()

    // Should show validation or prevent submission
    await expect(page.locator('button:has-text("Отправить отчет")')).toBeDisabled()
  })

  test('requires disclaimer acceptance', async ({ page }) => {
    // Fill form but don't check disclaimer
    await page.locator('input[placeholder*="номер телефона"]').fill('+77771234567')
    await page.locator('input[placeholder*="Kaspi Bank"]').fill('Test Bank')
    await page.locator('textarea[placeholder*="Опишите"]').fill('Test description')

    // Submit button should be disabled without disclaimer
    await expect(page.locator('button:has-text("Отправить отчет")')).toBeDisabled()
  })

  test('enables submit after disclaimer acceptance', async ({ page }) => {
    // Fill form
    await page.locator('input[placeholder*="номер телефона"]').fill('+77771234567')
    await page.locator('input[placeholder*="Kaspi Bank"]').fill('Test Bank')
    await page.locator('textarea[placeholder*="Опишите"]').fill('Test description')

    // Check disclaimer
    await page.locator('input[type="checkbox"]').check()

    // Submit button should now be enabled
    await expect(page.locator('button:has-text("Отправить отчет")')).toBeEnabled()
  })

  test('shows success message after submission', async ({ page }) => {
    // Mock successful API response
    await page.route('**/api/scams', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Success' })
      })
    })

    // Fill and submit form
    await page.locator('input[placeholder*="номер телефона"]').fill('+77771234567')
    await page.locator('input[placeholder*="Kaspi Bank"]').fill('Test Bank')
    await page.locator('textarea[placeholder*="Опишите"]').fill('Test description')
    await page.locator('input[type="checkbox"]').check()

    await page.locator('button:has-text("Отправить отчет")').click()

    // Should show success message
    await expect(page.locator('text=Отчет отправлен!')).toBeVisible()
  })

  test('handles form submission errors', async ({ page }) => {
    // Mock error response
    await page.route('**/api/scams', async route => {
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Validation error' })
      })
    })

    // Fill and submit form
    await page.locator('input[placeholder*="номер телефона"]').fill('+77771234567')
    await page.locator('input[placeholder*="Kaspi Bank"]').fill('Test Bank')
    await page.locator('textarea[placeholder*="Опишите"]').fill('Test description')
    await page.locator('input[type="checkbox"]').check()

    await page.locator('button:has-text("Отправить отчет")').click()

    // Should show error message
    await expect(page.locator('text=Validation error')).toBeVisible()
  })

  test('is mobile responsive', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })

    // Check form elements are visible on mobile
    await expect(page.locator('input[placeholder*="номер телефона"]')).toBeVisible()
    await expect(page.locator('button:has-text("Отправить отчет")')).toBeVisible()

    // Check responsive layout
    const form = page.locator('form')
    const boundingBox = await form.boundingBox()
    expect(boundingBox?.width).toBeLessThanOrEqual(375 - 32) // Account for padding
  })

  test('navigates back to home after success', async ({ page }) => {
    // Mock successful submission
    await page.route('**/api/scams', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Success' })
      })
    })

    // Fill and submit form
    await page.locator('input[placeholder*="номер телефона"]').fill('+77771234567')
    await page.locator('input[placeholder*="Kaspi Bank"]').fill('Test Bank')
    await page.locator('textarea[placeholder*="Опишите"]').fill('Test description')
    await page.locator('input[type="checkbox"]').check()

    await page.locator('button:has-text("Отправить отчет")').click()

    // Wait for redirect
    await page.waitForTimeout(2000)

    // Should redirect to home page
    await expect(page).toHaveURL(/\/$/)
  })
})

