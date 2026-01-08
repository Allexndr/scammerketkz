import crypto from 'crypto'

export interface MockScam {
    id: string;
    phone: string;
    phoneHash: string;
    identity: string;
    company: string;
    description: string;
    status: string;
    date: string;
    isVerified: boolean;
    likes: number;
    dislikes: number;
}

const generateHash = (phone: string) => {
    return crypto.createHash('sha256').update(phone.replace(/\D/g, '')).digest('hex');
};

export const MOCK_SCAMS: MockScam[] = [
    {
        id: '1',
        phone: '+7 (727) 364-51-55',
        phoneHash: generateHash('+77273645155'),
        identity: 'Сотрудник банка',
        company: 'Различные банки',
        description: 'Просит перевести средства на "безопасный счет". Классическая схема вишинга.',
        status: 'Заблокирован',
        date: '2025-2026',
        isVerified: true,
        likes: 0,
        dislikes: 0
    },
    {
        id: '2',
        phone: '+7 (777) 259-77-77',
        phoneHash: generateHash('+77772597777'),
        identity: 'Сотрудник банка',
        company: 'Банковские системы',
        description: 'Телефонное мошенничество (вишинг). Пытаются получить доступ к личному кабинету.',
        status: 'Заблокирован',
        date: '2025-2026',
        isVerified: true,
        likes: 0,
        dislikes: 0
    },
    {
        id: '3',
        phone: '+7 (777) 295-07-77',
        phoneHash: generateHash('+77772950777'),
        identity: 'Служба безопасности',
        company: 'Банки и госорганы',
        description: 'Запрашивает SMS-коды от номера 1414 (eGov). Пытаются войти в государственные сервисы.',
        status: 'Под наблюдением',
        date: '2025-2026',
        isVerified: true,
        likes: 0,
        dislikes: 0
    },
    {
        id: '4',
        phone: '+7 (717) 255-44-40',
        phoneHash: generateHash('+77172554440'),
        identity: 'Сотрудник банка',
        company: 'Финансовые учреждения',
        description: 'Схема с "безопасным счетом" и предотвращением "подозрительной транзакции".',
        status: 'Активен',
        date: '2025-2026',
        isVerified: false,
        likes: 0,
        dislikes: 0
    },
    {
        id: '5',
        phone: '+7 (777) 258-57-77',
        phoneHash: generateHash('+77772585777'),
        identity: 'Представитель органов',
        company: 'Банки/Полиция/КНБ',
        description: 'Двухэтапное мошенничество: сначала звонит "полицейский", затем "сотрудник банка".',
        status: 'Заблокирован',
        date: '2025-2026',
        isVerified: true,
        likes: 0,
        dislikes: 0
    },
    {
        id: '6',
        phone: '+7 (747) 680-02-10',
        identity: 'Бот проверки',
        phoneHash: generateHash('+77476800210'),
        company: 'Прокуратура г. Астана',
        description: 'Легитимный антифрод-бот в WhatsApp. ОСТОРОЖНО: иногда номер подделывают.',
        status: 'Проверить вручную',
        date: '2024-2026',
        isVerified: true,
        likes: 0,
        dislikes: 0
    },
    // Adding the specific list from the second table
    {
        id: '7',
        phone: '+7 (771) 931-04-92',
        phoneHash: generateHash('+77719310492'),
        identity: 'неизвестно',
        company: 'неизвестно',
        description: 'Поздравил с выигрышем подарка (робот-женский голос). Пытаются заманить на фишинговый сайт.',
        status: 'Активен',
        date: '2025',
        isVerified: true,
        likes: 0,
        dislikes: 0
    },
    {
        id: '8',
        phone: '+7 (771) 000-77-22',
        phoneHash: generateHash('+77710007722'),
        identity: 'сотрудник службы безопасности',
        company: 'Евразийский банк (Smart.bank.kz)',
        description: 'Сообщал о подозрительных операциях по карте и требовал ИИН, реквизиты карты и SMS-код.',
        status: 'Высокая угроза',
        date: '2025',
        isVerified: true,
        likes: 0,
        dislikes: 0
    },
    {
        id: '9',
        phone: '+7 (705) 201-59-23',
        phoneHash: generateHash('+77052015923'),
        identity: 'псевдособственник квартиры',
        company: 'Krisha.kz (подделка)',
        description: 'Предлагал снять квартиру, взял аванс 10000 ₸ под предлогом высокого спроса и пропал.',
        status: 'Мошенничество с арендой',
        date: '2025',
        isVerified: true,
        likes: 0,
        dislikes: 0
    },
    {
        id: '10',
        phone: '+7 (705) 334-12-01',
        phoneHash: generateHash('+77053341201'),
        identity: 'сотрудник магазина Topshopkz',
        company: 'Topshopkz (ShoplineKZ)',
        description: 'Продал некачественную подделку вместо оригинала. Будьте осторожны при оплате курьеру.',
        status: 'Недобросовестный продавец',
        date: '2025',
        isVerified: true,
        likes: 0,
        dislikes: 0
    }
];

export const TOP_COMPANIES = [
    "Kaspi.kz",
    "Halyk Bank",
    "Евразийский Банк",
    "Bank RBK",
    "Jusan Bank",
    "BCC (ЦентрКредит)",
    "Forte Bank",
    "Freedom Finance",
    "Kazpost (Казпочта)",
    "Air Astana",
    "FlyArystan",
    "Kcell / Activ",
    "Beeline",
    "Tele2 / Altel",
    "Krisha.kz",
    "Kolesa.kz",
    "Olx.kz",
    "Technodom",
    "Sulpak",
    "Mechta",
    "Wildberries",
    "Ozon",
    "Glovo",
    "Wollt",
    "Yandex Go",
    "Egov.kz (1414)",
    "Национальный Банк РК",
    "МВД РК",
    "Прокуратура",
    "Налоговая (КГД)"
];
