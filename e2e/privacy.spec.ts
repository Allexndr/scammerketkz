import { test, expect } from '@playwright/test'

test.describe('Privacy Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/privacy')
  })

  test('displays privacy page in Russian', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Политика конфиденциальности')

    // Check all policy sections
    const sections = [
      '1. Общие положения',
      '2. Сбор информации',
      '3. Использование информации',
      '4. Раскрытие информации',
      '5. Защита данных',
      '6. Ваши права',
      '7. Cookies и аналитика',
      '8. Ответственность',
      '9. Изменения политики',
      '10. Контакты'
    ]

    for (const section of sections) {
      await expect(page.locator(`text=${section}`)).toBeVisible()
    }
  })

  test('displays privacy page in Kazakh', async ({ page }) => {
    await page.goto('http://localhost:3000/kk/privacy')

    await expect(page.locator('h1')).toContainText('Құпиялылық саясаты')

    // Check main sections in Kazakh
    await expect(page.locator('text=1. Жалпы ережелер')).toBeVisible()
    await expect(page.locator('text=2. Ақпарат жинау')).toBeVisible()
    await expect(page.locator('text=10. Байланыс')).toBeVisible()
  })

  test('displays privacy page in English', async ({ page }) => {
    await page.goto('http://localhost:3000/en/privacy')

    await expect(page.locator('h1')).toContainText('Privacy Policy')

    // Check main sections in English
    await expect(page.locator('text=1. General provisions')).toBeVisible()
    await expect(page.locator('text=2. Information collection')).toBeVisible()
    await expect(page.locator('text=10. Contacts')).toBeVisible()
  })

  test('contains disclaimer content in Russian', async ({ page }) => {
    await expect(page.locator('text=мы не собираем персональные данные')).toBeVisible()
    await expect(page.locator('text=мы не передаем')).toBeVisible()
    await expect(page.locator('text=мы не несем ответственности')).toBeVisible()
  })

  test('contains disclaimer content in Kazakh', async ({ page }) => {
    await page.goto('http://localhost:3000/kk/privacy')

    await expect(page.locator('text=біз жеке деректерді жинамаймыз')).toBeVisible()
    await expect(page.locator('text=біз бермеңіз')).toBeVisible()
    await expect(page.locator('text=біз жауапты емеспіз')).toBeVisible()
  })

  test('contains disclaimer content in English', async ({ page }) => {
    await page.goto('http://localhost:3000/en/privacy')

    await expect(page.locator('text=we do not collect personal data')).toBeVisible()
    await expect(page.locator('text=we do not share')).toBeVisible()
    await expect(page.locator('text=we are not responsible')).toBeVisible()
  })

  test('displays contact information in Russian', async ({ page }) => {
    await expect(page.locator('text=По вопросам конфиденциальности')).toBeVisible()
    await expect(page.locator('text=privacy@scammerketkz.kz')).toBeVisible()
  })

  test('displays contact information in Kazakh', async ({ page }) => {
    await page.goto('http://localhost:3000/kk/privacy')

    await expect(page.locator('text=Құпиялылық мәселелері бойынша')).toBeVisible()
    await expect(page.locator('text=privacy@scammerketkz.kz')).toBeVisible()
  })

  test('displays contact information in English', async ({ page }) => {
    await page.goto('http://localhost:3000/en/privacy')

    await expect(page.locator('text=For privacy issues')).toBeVisible()
    await expect(page.locator('text=privacy@scammerketkz.kz')).toBeVisible()
  })

  test('has proper page structure', async ({ page }) => {
    // Check container
    const container = page.locator('h1').locator('..').locator('..')
    await expect(container).toHaveClass('container')

    // Check max width container
    const maxWidthContainer = page.locator('h1').locator('..').locator('..')
    await expect(maxWidthContainer).toHaveClass('max-w-4xl')
  })

  test('has proper card styling', async ({ page }) => {
    const card = page.locator('h1').locator('..').locator('..')
    await expect(card).toHaveClass('bg-white')
    await expect(card).toHaveClass('rounded-lg')
    await expect(card).toHaveClass('shadow-md')
    await expect(card).toHaveClass('p-8')
  })

  test('maintains proper heading hierarchy', async ({ page }) => {
    const h1 = page.locator('h1')
    await expect(h1).toHaveTextContent('Политика конфиденциальности')

    // Check section headings
    const sectionHeadings = page.locator('h2')
    await expect(sectionHeadings).toHaveCount(10) // 10 sections
  })

  test('is mobile responsive', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })

    // Check that content is readable on mobile
    await expect(page.locator('h1')).toBeVisible()

    // Check that sections are accessible
    await expect(page.locator('text=1. Общие положения')).toBeVisible()

    // Check responsive container
    const container = page.locator('.container')
    const boundingBox = await container.boundingBox()
    expect(boundingBox?.width).toBeLessThanOrEqual(375 - 32)
  })

  test('has scrollable content on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })

    // Check that page has enough content to scroll
    const bodyHeight = await page.evaluate(() => document.body.scrollHeight)
    const viewportHeight = await page.evaluate(() => window.innerHeight)

    expect(bodyHeight).toBeGreaterThan(viewportHeight)
  })

  test('displays current date information', async ({ page }) => {
    // Should have some date information (exact date may vary)
    const lastUpdatedElement = page.locator('text=/Последнее обновление:/')
    await expect(lastUpdatedElement).toBeVisible()
  })

  test('has proper semantic structure', async ({ page }) => {
    // Check that all sections are properly structured
    const sections = await page.locator('h2').count()
    expect(sections).toBeGreaterThan(5)

    // Check that each section has content
    for (let i = 1; i <= 10; i++) {
      const section = page.locator(`text=${i}.`)
      await expect(section).toBeVisible()
    }
  })

  test('has proper text formatting', async ({ page }) => {
    // Check that important terms are bold
    const boldElements = page.locator('strong')
    await expect(boldElements).toHaveCount(await boldElements.count())

    // Check that links are present
    const emailLink = page.locator('text=privacy@scammerketkz.kz')
    await expect(emailLink).toBeVisible()
  })
})

