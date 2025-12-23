import { test, expect } from '@playwright/test'

test.describe('AntiScamKZ Home Page', () => {
  test.beforeEach(async ({ page }) => {
    // Mock API responses
    await page.route('**/api/analytics/top-companies', async route => {
      await route.fulfill({
        json: {
          topCompanies: [
            { company: 'Test Bank', totalReports: 10, verificationRate: 80 },
            { company: 'Fake Shop', totalReports: 5, verificationRate: 60 }
          ],
          totalStats: {
            totalScams: 15,
            verificationRate: 73,
            totalVotes: 25
          }
        }
      })
    })

    await page.goto('http://localhost:3000')
  })

  test('displays main title and navigation', async ({ page }) => {
    await expect(page).toHaveTitle(/AntiScamKZ/)

    // Check main heading
    await expect(page.locator('h1')).toContainText('AntiScamKZ')

    // Check navigation links
    await expect(page.locator('nav')).toContainText('Главная')
    await expect(page.locator('nav')).toContainText('Сообщить')
    await expect(page.locator('nav')).toContainText('Рейтинг')
  })

  test('shows disclaimer prominently', async ({ page }) => {
    const disclaimer = page.locator('.disclaimer-box, [class*="yellow"]')
    await expect(disclaimer).toContainText('Важное предупреждение')
    await expect(disclaimer).toContainText('мы не модерируем контент')
  })

  test('has search functionality', async ({ page }) => {
    const searchSection = page.locator('h2:has-text("Проверить номер")').locator('..')
    await expect(searchSection.locator('input[type="text"]')).toBeVisible()
    await expect(searchSection.locator('button:has-text("Найти")')).toBeVisible()
  })

  test('displays statistics overview', async ({ page }) => {
    await expect(page.locator('text=Всего сообщений')).toBeVisible()
    await expect(page.locator('text=Верифицировано')).toBeVisible()
    await expect(page.locator('text=Всего голосов')).toBeVisible()
  })

  test('shows top companies section', async ({ page }) => {
    await expect(page.locator('h2:has-text("Топ компаний-мошенников")')).toBeVisible()
    await expect(page.locator('text=Test Bank')).toBeVisible()
    await expect(page.locator('text=Fake Shop')).toBeVisible()
  })

  test('has call-to-action buttons', async ({ page }) => {
    const actionsSection = page.locator('h2:has-text("Действия")').locator('..')
    await expect(actionsSection.locator('text=Сообщить о мошеннике')).toBeVisible()
    await expect(actionsSection.locator('text=Все сообщения')).toBeVisible()
    await expect(actionsSection.locator('text=Рейтинг пользователей')).toBeVisible()
  })

  test('displays footer with links', async ({ page }) => {
    const footer = page.locator('footer')
    await expect(footer).toContainText('AntiScamKZ')
    await expect(footer).toContainText('Политика конфиденциальности')
  })

  test('is mobile responsive', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })

    // Check that main elements are still visible on mobile
    await expect(page.locator('h1')).toBeVisible()
    await expect(page.locator('nav')).toBeVisible()
    await expect(page.locator('input[type="text"]')).toBeVisible()
  })
})


