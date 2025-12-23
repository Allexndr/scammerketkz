import { test, expect } from '@playwright/test'

test.describe('ScammerKetKz Home Page', () => {
  test.beforeEach(async ({ page }) => {
    // Mock API responses for consistent testing
    await page.route('**/api/analytics/top-companies', async route => {
      await route.fulfill({
        json: {
          topCompanies: [
            { company: 'Kaspi Bank', totalReports: 25, verificationRate: 85 },
            { company: 'Halyk Bank', totalReports: 18, verificationRate: 72 },
            { company: 'Freedom Finance', totalReports: 12, verificationRate: 65 }
          ],
          totalStats: {
            totalScams: 150,
            totalVerified: 120,
            verificationRate: 80,
            totalVotes: 500
          }
        }
      })
    })

    await page.route('**/api/scams*', async route => {
      await route.fulfill({
        json: {
          scams: [
            {
              _id: '1',
              phoneNumber: '777****567',
              company: 'Kaspi Bank',
              scamType: 'phishing',
              verificationRate: 85,
              likes: 12,
              dislikes: 2,
              commentCount: 5
            }
          ],
          pagination: {
            page: 1,
            limit: 20,
            total: 150,
            pages: 8
          }
        }
      })
    })

    await page.goto('http://localhost:3000')
  })

  test('displays main title and navigation in Russian', async ({ page }) => {
    await expect(page).toHaveTitle(/ScammerKetKz/)

    // Check main heading
    await expect(page.locator('h1')).toContainText('ScammerKetKz')

    // Check navigation links
    await expect(page.locator('nav')).toContainText('Главная')
    await expect(page.locator('nav')).toContainText('Сообщить')
    await expect(page.locator('nav')).toContainText('Рейтинг')
  })

  test('displays main title and navigation in Kazakh', async ({ page }) => {
    await page.goto('http://localhost:3000/kk')

    await expect(page.locator('h1')).toContainText('ScammerKetKz')
    await expect(page.locator('nav')).toContainText('Басты бет')
    await expect(page.locator('nav')).toContainText('Хабарлау')
    await expect(page.locator('nav')).toContainText('Рейтинг')
  })

  test('displays main title and navigation in English', async ({ page }) => {
    await page.goto('http://localhost:3000/en')

    await expect(page.locator('h1')).toContainText('ScammerKetKz')
    await expect(page.locator('nav')).toContainText('Home')
    await expect(page.locator('nav')).toContainText('Report')
    await expect(page.locator('nav')).toContainText('Leaderboard')
  })

  test('shows disclaimer prominently in Russian', async ({ page }) => {
    const disclaimer = page.locator('.disclaimer-box, [class*="yellow"]')
    await expect(disclaimer).toContainText('Важное предупреждение')
    await expect(disclaimer).toContainText('мы не модерируем контент')
  })

  test('shows disclaimer prominently in Kazakh', async ({ page }) => {
    await page.goto('http://localhost:3000/kk')
    const disclaimer = page.locator('.disclaimer-box, [class*="yellow"]')
    await expect(disclaimer).toContainText('Маңызды ескерту')
    await expect(disclaimer).toContainText('біз мазмұнды модерация жасамаймыз')
  })

  test('shows disclaimer prominently in English', async ({ page }) => {
    await page.goto('http://localhost:3000/en')
    const disclaimer = page.locator('.disclaimer-box, [class*="yellow"]')
    await expect(disclaimer).toContainText('Important warning')
    await expect(disclaimer).toContainText('we do not moderate content')
  })

  test('has search functionality in Russian', async ({ page }) => {
    const searchSection = page.locator('h2:has-text("🔍 Проверить номер телефона")').locator('..')
    await expect(searchSection.locator('input[type="text"]')).toBeVisible()
    await expect(searchSection.locator('button:has-text("Найти")')).toBeVisible()
  })

  test('has search functionality in Kazakh', async ({ page }) => {
    await page.goto('http://localhost:3000/kk')
    const searchSection = page.locator('h2:has-text("🔍 Телефон нөмірін тексеру")').locator('..')
    await expect(searchSection.locator('input[type="text"]')).toBeVisible()
    await expect(searchSection.locator('button:has-text("Табу")')).toBeVisible()
  })

  test('has search functionality in English', async ({ page }) => {
    await page.goto('http://localhost:3000/en')
    const searchSection = page.locator('h2:has-text("🔍 Check phone number")').locator('..')
    await expect(searchSection.locator('input[type="text"]')).toBeVisible()
    await expect(searchSection.locator('button:has-text("Find")')).toBeVisible()
  })

  test('displays statistics overview in Russian', async ({ page }) => {
    await expect(page.locator('text=📊 Статистика платформы')).toBeVisible()
    await expect(page.locator('text=Всего сообщений')).toBeVisible()
    await expect(page.locator('text=Верифицировано')).toBeVisible()
    await expect(page.locator('text=Всего голосов')).toBeVisible()
  })

  test('shows top companies section in Russian', async ({ page }) => {
    await expect(page.locator('h2:has-text("🏆 Топ компаний-мошенников")')).toBeVisible()
    await expect(page.locator('text=Kaspi Bank')).toBeVisible()
    await expect(page.locator('text=Halyk Bank')).toBeVisible()
  })

  test('has call-to-action buttons in Russian', async ({ page }) => {
    const actionsSection = page.locator('h2:has-text("🚀 Быстрые действия")').locator('..')
    await expect(actionsSection.locator('text=📝 Сообщить о мошеннике')).toBeVisible()
    await expect(actionsSection.locator('text=📋 Все сообщения')).toBeVisible()
    await expect(actionsSection.locator('text=🏆 Рейтинг пользователей')).toBeVisible()
  })

  test('displays statistics overview in Kazakh', async ({ page }) => {
    await page.goto('http://localhost:3000/kk')
    await expect(page.locator('text=📊 Платформа статистикасы')).toBeVisible()
    await expect(page.locator('text=Барлық хабарламалар')).toBeVisible()
    await expect(page.locator('text=Тексерілген')).toBeVisible()
  })

  test('shows top companies section in Kazakh', async ({ page }) => {
    await page.goto('http://localhost:3000/kk')
    await expect(page.locator('h2:has-text("🏆 Алаяқтық компаниялардың үздіктері")')).toBeVisible()
  })

  test('has call-to-action buttons in Kazakh', async ({ page }) => {
    await page.goto('http://localhost:3000/kk')
    const actionsSection = page.locator('h2:has-text("🚀 Жылдам әрекеттер")').locator('..')
    await expect(actionsSection.locator('text=📝 Алаяқ туралы хабарлау')).toBeVisible()
    await expect(actionsSection.locator('text=📋 Барлық хабарламалар')).toBeInTheDocument()
  })

  test('displays footer with links in Russian', async ({ page }) => {
    const footer = page.locator('footer')
    await expect(footer).toContainText('ScammerKetKz')
    await expect(footer).toContainText('Политика конфиденциальности')
  })

  test('displays footer with links in Kazakh', async ({ page }) => {
    await page.goto('http://localhost:3000/kk')
    const footer = page.locator('footer')
    await expect(footer).toContainText('ScammerKetKz')
    await expect(footer).toContainText('Құпиялылық')
  })

  test('displays footer with links in English', async ({ page }) => {
    await page.goto('http://localhost:3000/en')
    const footer = page.locator('footer')
    await expect(footer).toContainText('ScammerKetKz')
    await expect(footer).toContainText('Privacy')
  })

  test('language switcher works', async ({ page }) => {
    // Test switching from Russian to Kazakh
    await page.locator('button[aria-label*="language"]').click()
    await page.locator('text=Қазақша').click()

    await expect(page.locator('h1')).toContainText('ScammerKetKz')
    await expect(page.locator('nav')).toContainText('Басты бет')
  })

  test('language preference persists', async ({ page }) => {
    // Set language to Kazakh
    await page.locator('button[aria-label*="language"]').click()
    await page.locator('text=Қазақша').click()

    // Reload page
    await page.reload()

    // Should still be in Kazakh
    await expect(page.locator('nav')).toContainText('Басты бет')
  })

  test('is mobile responsive in Russian', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })

    // Check mobile menu button is visible
    await expect(page.locator('button[aria-label="Меню"]')).toBeVisible()

    // Open mobile menu
    await page.locator('button[aria-label="Меню"]').click()

    // Check mobile menu items
    await expect(page.locator('text=Сообщить')).toBeVisible()
    await expect(page.locator('text=Рейтинг')).toBeVisible()

    // Check that main elements are still visible on mobile
    await expect(page.locator('h1')).toBeVisible()
    await expect(page.locator('nav')).toBeVisible()
    await expect(page.locator('input[type="text"]')).toBeVisible()
  })

  test('is mobile responsive in Kazakh', async ({ page }) => {
    await page.goto('http://localhost:3000/kk')
    await page.setViewportSize({ width: 375, height: 667 })

    // Check mobile menu button is visible
    await expect(page.locator('button[aria-label="Мәзір"]')).toBeVisible()

    // Open mobile menu
    await page.locator('button[aria-label="Мәзір"]').click()

    // Check mobile menu items
    await expect(page.locator('text=Хабарлау')).toBeVisible()
    await expect(page.locator('text=Рейтинг')).toBeVisible()
  })

  test('is mobile responsive in English', async ({ page }) => {
    await page.goto('http://localhost:3000/en')
    await page.setViewportSize({ width: 375, height: 667 })

    // Check mobile menu button is visible
    await expect(page.locator('button[aria-label="Menu"]')).toBeVisible()

    // Open mobile menu
    await page.locator('button[aria-label="Menu"]').click()

    // Check mobile menu items
    await expect(page.locator('text=Report')).toBeVisible()
    await expect(page.locator('text=Leaderboard')).toBeVisible()
  })
})


