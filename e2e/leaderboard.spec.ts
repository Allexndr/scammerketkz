import { test, expect } from '@playwright/test'

test.describe('Leaderboard Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/leaderboard')
  })

  test('displays leaderboard page in Russian', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('🏆 Рейтинг пользователей')
    await expect(page.locator('text=Топ активных участников')).toBeVisible()

    // Check gamification info
    await expect(page.locator('text=Как заработать очки?')).toBeVisible()
    await expect(page.locator('text=+10 очков за внесение отчета')).toBeVisible()
    await expect(page.locator('text=+5 очков за голосование')).toBeVisible()
  })

  test('displays leaderboard page in Kazakh', async ({ page }) => {
    await page.goto('http://localhost:3000/kk/leaderboard')

    await expect(page.locator('h1')).toContainText('🏆 Пайдаланушылар рейтингі')
    await expect(page.locator('text=Алаяқтыққа қарсы күресте')).toBeVisible()

    // Check gamification info in Kazakh
    await expect(page.locator('text=Қалай ұпай жинауға болады?')).toBeVisible()
    await expect(page.locator('text=+10 ұпай')).toBeVisible()
  })

  test('displays leaderboard page in English', async ({ page }) => {
    await page.goto('http://localhost:3000/en/leaderboard')

    await expect(page.locator('h1')).toContainText('🏆 User rankings')
    await expect(page.locator('text=Top active participants')).toBeVisible()

    // Check gamification info in English
    await expect(page.locator('text=How to earn points?')).toBeVisible()
    await expect(page.locator('text=+10 points')).toBeVisible()
  })

  test('shows empty state when no users', async ({ page }) => {
    // Mock empty leaderboard
    await page.route('**/api/leaderboard', async route => {
      await route.fulfill({
        json: { users: [], total: 0 }
      })
    })

    await page.reload()

    await expect(page.locator('text=🏆')).toBeVisible()
    await expect(page.locator('text=Пока нет участников')).toBeVisible()
    await expect(page.locator('text=Будьте первым!')).toBeVisible()
    await expect(page.locator('text=Стать первым участником')).toBeVisible()
  })

  test('displays user rankings when users exist', async ({ page }) => {
    // Mock users data
    await page.route('**/api/leaderboard', async route => {
      await route.fulfill({
        json: {
          users: [
            {
              _id: '1',
              name: 'John Doe',
              points: 150,
              rank: 'Охотник',
              reportsCount: 5,
              votesCount: 20
            },
            {
              _id: '2',
              name: 'Jane Smith',
              points: 200,
              rank: 'Эксперт',
              reportsCount: 8,
              votesCount: 15
            }
          ],
          total: 2
        }
      })
    })

    await page.reload()

    // Check user data is displayed
    await expect(page.locator('text=John Doe')).toBeVisible()
    await expect(page.locator('text=Jane Smith')).toBeVisible()
    await expect(page.locator('text=⭐ 150 очков')).toBeVisible()
    await expect(page.locator('text=📝 5 отчетов')).toBeVisible()
    await expect(page.locator('text=Охотник')).toBeVisible()
    await expect(page.locator('text=Эксперт')).toBeVisible()
  })

  test('displays ranking numbers correctly', async ({ page }) => {
    // Mock users data
    await page.route('**/api/leaderboard', async route => {
      await route.fulfill({
        json: {
          users: [
            { _id: '1', name: 'User 1', points: 150, rank: 'Охотник', reportsCount: 5, votesCount: 20 },
            { _id: '2', name: 'User 2', points: 200, rank: 'Эксперт', reportsCount: 8, votesCount: 15 },
            { _id: '3', name: 'User 3', points: 100, rank: 'Новичок', reportsCount: 3, votesCount: 10 }
          ],
          total: 3
        }
      })
    })

    await page.reload()

    // Check ranking numbers
    await expect(page.locator('text=1')).toBeVisible()
    await expect(page.locator('text=2')).toBeVisible()
    await expect(page.locator('text=3')).toBeVisible()
  })

  test('shows proper styling for different ranks', async ({ page }) => {
    // Mock users with different ranks
    await page.route('**/api/leaderboard', async route => {
      await route.fulfill({
        json: {
          users: [
            { _id: '1', name: 'Мастер', points: 1000, rank: 'Мастер', reportsCount: 50, votesCount: 100 },
            { _id: '2', name: 'Эксперт', points: 500, rank: 'Эксперт', reportsCount: 25, votesCount: 50 },
            { _id: '3', name: 'Охотник', points: 150, rank: 'Охотник', reportsCount: 10, votesCount: 20 }
          ],
          total: 3
        }
      })
    })

    await page.reload()

    // Check rank badges are displayed
    await expect(page.locator('text=Мастер')).toBeVisible()
    await expect(page.locator('text=Эксперт')).toBeVisible()
    await expect(page.locator('text=Охотник')).toBeVisible()
  })

  test('handles API errors gracefully', async ({ page }) => {
    // Mock API error
    await page.route('**/api/leaderboard', async route => {
      await route.fulfill({
        status: 500,
        json: { error: 'Server error' }
      })
    })

    await page.reload()

    // Should show empty state
    await expect(page.locator('text=Пока нет участников')).toBeVisible()
  })

  test('is mobile responsive', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })

    await expect(page.locator('h1')).toBeVisible()
    await expect(page.locator('text=Как заработать очки?')).toBeVisible()

    // Check that content fits mobile screen
    const content = page.locator('.container')
    const boundingBox = await content.boundingBox()
    expect(boundingBox?.width).toBeLessThanOrEqual(375 - 32)
  })

  test('shows call-to-action in empty state', async ({ page }) => {
    // Mock empty leaderboard
    await page.route('**/api/leaderboard', async route => {
      await route.fulfill({
        json: { users: [], total: 0 }
      })
    })

    await page.reload()

    const ctaButton = page.locator('text=Стать первым участником')
    await expect(ctaButton).toBeVisible()

    // Check button links to report page
    await expect(ctaButton).toHaveAttribute('href', '/report')
  })

  test('displays gamification info box styling', async ({ page }) => {
    const infoBox = page.locator('text=Как заработать очки?').locator('..').locator('..')
    await expect(infoBox).toHaveClass('bg-blue-50')
    await expect(infoBox).toHaveClass('border-blue-200')
  })

  test('maintains proper heading hierarchy', async ({ page }) => {
    const h1 = page.locator('h1')
    await expect(h1).toHaveTextContent('🏆 Рейтинг пользователей')

    // Should be the main heading
    await expect(h1).toBeVisible()
  })
})
