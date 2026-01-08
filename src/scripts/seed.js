
const mongoose = require('mongoose');
const crypto = require('crypto');

// MongoDB URI from .env.local
const MONGODB_URI = 'mongodb+srv://Vercel-Admin-scam:3RJZ9U4EFsggdIkX@scam.b1cuapw.mongodb.net/?retryWrites=true&w=majority&appName=scam';

// Mock data to seed
const MOCK_SCAMS = [
    {
        id: '1',
        phone: '+7 (727) 364-51-55',
        company: 'Различные банки/Полиция',
        description: 'Звонят якобы из полиции или Нацбанка, говорят что на вас оформлен кредит. Требуют перевести деньги на "безопасный счет". Очень агрессивные.',
        isVerified: true,
        type: 'vishing',
        likes: 145,
        dislikes: 2,
        status: 'verified',
        createdAt: new Date('2025-12-11T10:00:00Z')
    },
    {
        id: '2',
        phone: '+7 (777) 259-77-77',
        company: 'Банковские системы безопасности',
        description: 'Представляются службой безопасности банка. Знают ФИО. Говорят о подозрительной транзакции. Просят код из СМС.',
        isVerified: true,
        type: 'vishing',
        likes: 89,
        dislikes: 5,
        status: 'verified',
        createdAt: new Date('2025-12-12T14:30:00Z')
    },
    {
        id: '3',
        phone: '+7 (777) 295-07-77',
        company: 'Банки и госорганы',
        description: 'Звонок от "майора полиции". Угрожают уголовным делом за пособничество мошенникам. Требуют установить AnyDesk.',
        isVerified: true,
        type: 'vishing',
        likes: 230,
        dislikes: 12,
        status: 'verified',
        createdAt: new Date('2025-12-13T09:15:00Z')
    },
    {
        id: '4',
        phone: '+7 (717) 255-44-40',
        company: 'Финансовые учреждения',
        description: 'Предлагают "выгодные инвестиции" от КазМунайГаз или Халык Банк. Обещают 300% годовых. Фишинг.',
        isVerified: true,
        type: 'investment',
        likes: 56,
        dislikes: 1,
        status: 'verified',
        createdAt: new Date('2025-12-14T16:45:00Z')
    },
    {
        id: '5',
        phone: '+7 (777) 258-57-77',
        company: 'Банки/Полиция/КНБ',
        description: 'Схема "на ваше имя взяли кредит". Просят пройти биометрию по видеозвонку чтобы "аннулировать" заявку.',
        isVerified: true,
        type: 'vishing',
        likes: 112,
        dislikes: 3,
        status: 'verified',
        createdAt: new Date('2025-12-15T11:20:00Z')
    },
    {
        id: '6',
        phone: '+7 (747) 680-02-10',
        company: 'Прокуратура г. Астана',
        description: 'Фейковая повестка в суд. Рассылка в WhatsApp. Просят перейти по ссылке чтобы ознакомиться с делом. Ссылка фишинговая.',
        isVerified: true,
        type: 'phishing',
        likes: 45,
        dislikes: 0,
        status: 'verified',
        createdAt: new Date('2025-12-16T13:10:00Z')
    },
    {
        id: '7',
        phone: '+7 (771) 931-04-92',
        company: 'неизвестно',
        description: 'Молчаливый звонок, сброс. При перезвоне снимают баланс. Спам прозвон.',
        isVerified: false,
        type: 'spam',
        likes: 12,
        dislikes: 8,
        status: 'pending',
        createdAt: new Date('2025-12-17T18:00:00Z')
    },
    {
        id: '8',
        phone: '+7 (771) 000-77-22',
        company: 'Евразийский банк (Smart.bank.kz)',
        description: 'Звонят якобы с банка Евразийский. Предлагают рассрочку или кредит. Могут быть навязчивыми.',
        isVerified: false,
        type: 'spam',
        likes: 5,
        dislikes: 20,
        status: 'pending',
        createdAt: new Date('2025-12-18T10:05:00Z')
    },
    {
        id: '9',
        phone: '+7 (705) 201-59-23',
        company: 'Krisha.kz (подделка)',
        description: 'Мошенники по аренде квартир. Просят предоплату на Kaspi Gold без показа квартиры. Объявление на Крыше - фейк.',
        isVerified: true,
        type: 'scam',
        likes: 210,
        dislikes: 4,
        status: 'verified',
        createdAt: new Date('2025-12-19T15:50:00Z')
    },
    {
        id: '10',
        phone: '+7 (705) 334-12-01',
        company: 'Topshopkz (ShoplineKZ)',
        description: 'Интернет-магазин в Instagram. Продают товары с большими скидками. Берут оплату и блокируют.',
        isVerified: true,
        type: 'scam',
        likes: 98,
        dislikes: 2,
        status: 'verified',
        createdAt: new Date('2025-12-20T12:00:00Z')
    }
];

// Define User Schema (Simplified)
const userSchema = new mongoose.Schema({
    name: String,
    phone: String,
    role: String,
    points: { type: Number, default: 0 },
    rank: { type: String, default: 'Новичок' },
    reportsCount: { type: Number, default: 0 }
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

// Define Scam Schema
const scamSchema = new mongoose.Schema({
    phoneNumber: { type: String, required: true },
    phoneHash: { type: String, required: true },
    company: String,
    scamType: String,
    description: String,
    isVerified: Boolean,
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    status: String,
    reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

const Scam = mongoose.models.Scam || mongoose.model('Scam', scamSchema);

async function seed() {
    console.log('🌱 Connecting to MongoDB Atlas...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected!');

    try {
        // 1. Create Admin User
        console.log('👤 Creating Admin user...'); // Or finding if exists
        let admin = await User.findOne({ name: 'Админ' });

        if (!admin) {
            admin = await User.create({
                name: 'Админ',
                phone: '+7 (777) 777-77-77',
                role: 'admin',
                points: 250,
                rank: 'Легенда',
                reportsCount: 10
            });
            console.log('✅ Admin user created.');
        } else {
            console.log('ℹ️ Admin user already exists.');
        }

        // 2. Clear existing Scams (Optional - commented out to be safe)
        // await Scam.deleteMany({}); 

        // 3. Insert Scams
        console.log('📦 Seeding scams...');
        const scamsToInsert = MOCK_SCAMS.map(scam => ({
            phoneNumber: scam.phone,
            phoneHash: crypto.createHash('sha256').update(scam.phone.replace(/\D/g, '')).digest('hex'),
            company: scam.company,
            scamType: scam.type || 'other',
            description: scam.description,
            isVerified: scam.isVerified,
            likes: scam.likes,
            dislikes: scam.dislikes,
            status: scam.status,
            reportedBy: admin._id,
            createdAt: scam.createdAt
        }));

        // Insert avoiding duplicates
        for (const s of scamsToInsert) {
            const exists = await Scam.findOne({ phoneHash: s.phoneHash });
            if (!exists) {
                await Scam.create(s);
            }
        }

        console.log(`✅ Successfully seeded ${scamsToInsert.length} scams into Atlas!`);

    } catch (error) {
        console.error('❌ Error seeding DB:', error);
    } finally {
        await mongoose.disconnect();
        console.log('👋 Disconnected.');
    }
}

seed();
