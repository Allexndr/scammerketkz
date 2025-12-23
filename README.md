# 🚀 ScammerKetKz - Анти-мошенническая платформа Казахстана

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38B2AC)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248)](https://www.mongodb.com/)
[![Jest](https://img.shields.io/badge/Jest-Testing-C21325)](https://jestjs.io/)
[![Playwright](https://img.shields.io/badge/Playwright-E2E-2EAD33)](https://playwright.dev/)

**Краудсорсинг-платформа для коллективной борьбы с мошенничеством в Казахстане.** Пользователи могут проверять подозрительные номера, вносить отчеты о мошенниках и голосовать за достоверность информации.

🌐 **[Демо на Vercel](https://scammerketkz.vercel.app)** | 📱 **[Telegram бот](https://t.me/scammerketkz_bot)**

## ✨ Возможности

### 🎯 Основной функционал
- **🔍 Проверка номеров** - Быстрый поиск по базе мошенников
- **📝 Добавление отчетов** - Форма с валидацией и CAPTCHA
- **🗳️ Система голосования** - Лайки/дизлайки для верификации
- **📊 Топ компаний** - Рейтинг самых активных мошенников
- **🏆 Рейтинг пользователей** - Gamification с баллами и рангами

### 🤖 Telegram бот
- `/check <номер>` - Проверить номер телефона
- `/add` - Добавить отчет о мошеннике
- `/top` - Посмотреть топ компаний
- `/help` - Справка

### 💰 Монетизация
- **Google AdSense** - Адаптивные баннеры
- **Yandex RTB** - Нативная реклама
- **Оптимизированная верстка** для максимального дохода

## 🚀 Особенности

- **Проверка номеров**: Быстрый поиск по базе мошенников
- **Краудсорсинг-верификация**: Система лайков/дизлайков для проверки данных
- **Топ компаний**: Рейтинг компаний, от которых чаще всего звонят мошенники
- **Gamification**: Система баллов и рангов для активных пользователей
- **Telegram бот**: Удобный доступ через Telegram
- **Экспорт данных**: CSV/JSON/PDF для анализа и интеграций
- **Полная анонимность**: Хэширование номеров, защита данных

## 🛠️ Технологии

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **База данных**: MongoDB Atlas
- **Бот**: Telegram Bot API
- **Деплой**: Vercel (бесплатно)

## 📋 Требования

- Node.js 18+
- MongoDB Atlas аккаунт
- Telegram Bot Token (от @BotFather)

## 🚀 Быстрый старт

1. **Клонируйте репозиторий:**
   ```bash
   git clone https://github.com/Allexndr/scammerketkz.git
   cd scammerketkz
   ```

2. **Установите зависимости:**
   ```bash
   npm install
   ```

3. **Настройте переменные окружения:**
   Создайте `.env.local` файл:
   ```env
   MONGODB_URI=mongodb+srv://Vercel-Admin-scam:3RJZ9U4EFsggdIkX@scam.b1cuapw.mongodb.net/?retryWrites=true&w=majority
   NEXTAUTH_SECRET=your-secret-key-here-change-this
   TELEGRAM_BOT_TOKEN=your-telegram-bot-token
   ADMIN_EMAIL=admin@scammerketkz.kz
   ```

4. **Запустите приложение:**
   ```bash
   npm run dev
   ```
   🌐 Открыть: `http://localhost:3000`

5. **Запустите Telegram бота:**
   ```bash
   npm run bot
   ```

6. **Запустите тесты:**
   ```bash
   npm test              # Unit & Integration tests
   npm run test:e2e      # E2E tests (нужен запущенный dev сервер)
   npm run test:coverage # Coverage report
   ```

## 📁 Структура проекта

```
antiscamkz/
├── app/                    # Next.js App Router
│   ├── api/               # API endpoints
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── bot/                   # Telegram bot
├── components/            # React components
├── lib/                   # Utilities and database
│   ├── models/           # MongoDB schemas
│   └── mongodb.ts        # Database connection
└── public/               # Static assets
```

## 🔧 API Endpoints

### Основные endpoints:
- `GET /api/search?q=номер` - Поиск мошенников
- `POST /api/scams` - Добавление отчета
- `POST /api/scams/[id]/vote` - Голосование
- `GET /api/analytics/top-companies` - Топ компаний
- `GET /api/export` - Экспорт данных

## 🧪 Тестирование

Проект включает comprehensive тестовый набор:

### Unit Tests (Jest)
```bash
npm test
```
- **Smoke tests** - базовые проверки функциональности
- **API tests** - тестирование эндпоинтов
- **Utility tests** - тестирование утилит (хэширование, валидация)

### E2E Tests (Playwright)
```bash
npm run test:e2e
```
- **Home page tests** - проверка главной страницы
- **User interaction tests** - тестирование пользовательских сценариев
- **Responsive design tests** - проверка мобильной адаптации

### Coverage Report
```bash
npm run test:coverage
```

## 🤖 Telegram Bot

Команды бота:
- `/start` - Приветствие
- `/check <номер>` - Проверить номер
- `/add` - Добавить отчет
- `/top` - Топ компаний
- `/help` - Справка

## ⚖️ Правовые аспекты

- **Нет модерации**: Верификация через пользовательское голосование
- **Полные дисклеймеры**: Во всех формах и на страницах
- **Политика конфиденциальности**: Соответствует законам РК
- **Анонимизация данных**: Хэширование номеров телефонов

## 📊 Аналитика

Платформа предоставляет:
- Топ-10 компаний мошенников
- Статистика по регионам
- Графики верификации
- Экспорт для исследований

## 💰 Монетизация

Платформа включает готовую систему монетизации:

### Рекламные блоки:
- **Google AdSense** - баннеры 728x90, 300x600, 320x50
- **Yandex RTB** - нативная реклама и баннеры
- **Адаптивный дизайн** - разная реклама для desktop/mobile

### Настройка рекламы:
1. Зарегистрируйтесь в Google AdSense
2. Получите Publisher ID
3. Обновите `AdBanner.tsx` и `AdSidebar.tsx` с реальными ID
4. Аналогично настройте Yandex Advertising

### Рекламные позиции:
- **Header banner** - 728x90 (desktop), 320x50 (mobile)
- **Sidebar** - 300x600 + 300x300 (desktop only)
- **Content** - нативная реклама между секциями

## 🔒 Безопасность

- Rate limiting на API
- CAPTCHA на формах
- Шифрование данных
- Регулярные аудиты

## 🤝 Вклад в проект

Мы приветствуем вклад! Пожалуйста:
1. Fork репозиторий
2. Создайте feature branch
3. Commit изменения
4. Push и создайте Pull Request

## 📞 Контакты

- Email: support@antiscamkz.kz
- Telegram: @antiscamkz_support

## ⚠️ Важно

**Эта платформа не несет ответственности за достоверность данных.** Все информация предоставляется пользователями и проверяется через голосование. Используйте информацию на свой страх и риск.

## 📊 Статус проекта

### ✅ Реализовано:
- [x] Базовая архитектура (Next.js + MongoDB)
- [x] Формы поиска и добавления мошенников
- [x] Система голосования (лайки/дизлайки)
- [x] Аналитика и топы компаний
- [x] Telegram бот
- [x] Gamification система
- [x] Экспорт данных
- [x] Рекламная интеграция
- [x] Тестовый набор
- [x] Политика конфиденциальности

### 🔄 В процессе:
- [ ] Система аутентификации пользователей
- [ ] Расширенная система голосования
- [ ] Продвинутая аналитика
- [ ] Мобильное приложение

### 🎯 Следующие шаги:
1. **Запуск MVP** - базовая версия с основным функционалом
2. **Добавление пользователей** - регистрация и профили
3. **Масштабирование** - оптимизация производительности
4. **Партнерства** - интеграция с банками и полицией

## 🚀 Деплой

### Vercel (Рекомендуется)
```bash
npm install -g vercel
vercel --prod
```

### Настройка рекламы
1. Зарегистрируйтесь в [Google AdSense](https://adsense.google.com)
2. Получите Publisher ID
3. Замените `YOUR_PUBLISHER_ID` в компонентах:
   - `src/components/AdBanner.tsx`
   - `src/components/AdSidebar.tsx`
4. Аналогично настройте [Yandex Advertising](https://direct.yandex.ru/)

## 📊 Архитектура

```
scammerketkz/
├── app/                    # Next.js App Router
│   ├── api/               # REST API endpoints
│   ├── globals.css        # Global styles
│   └── page.tsx           # Home page
├── src/
│   ├── components/        # React components
│   └── lib/              # Database models & utilities
├── bot/                   # Telegram bot
├── __tests__/            # Comprehensive test suite
├── e2e/                  # E2E tests
└── public/               # Static assets
```

## 🤝 Вклад в проект

Мы приветствуем вклад! Пожалуйста:

1. **Fork** репозиторий
2. Создайте **feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit** изменения: `git commit -m 'Add amazing feature'`
4. **Push** в branch: `git push origin feature/amazing-feature`
5. Откройте **Pull Request**

### 📋 Стандарты кода
- **ESLint** для линтинга
- **Prettier** для форматирования
- **TypeScript** для типизации
- **Jest** для тестирования

## 📄 Лицензия

Этот проект распространяется под лицензией **MIT**. Подробности в файле `LICENSE`.

## ⚠️ Дисклеймер

**ScammerKetKz** - краудсорсинг-платформа. Мы не модерируем контент и не несем ответственности за достоверность информации. Все данные предоставляются пользователями и проверяются через голосование. Используйте информацию на свой страх и риск.

---

## 🎉 Благодарности

- **Казахстанскому сообществу** за поддержку идеи
- **Open source сообществу** за отличные инструменты
- **Всем, кто борется с мошенничеством** в сети

**Сделано с ❤️ для безопасного Казахстана** 🇰🇿

## 📞 Контакты

- **GitHub Issues**: [Сообщить о баге](https://github.com/Allexndr/scammerketkz/issues)
- **Email**: support@scammerketkz.kz
- **Telegram**: @scammerketkz_support

---

⭐ **Если проект оказался полезным, поставьте звезду на GitHub!** ⭐