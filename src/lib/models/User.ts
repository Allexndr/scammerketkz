import mongoose from 'mongoose'

export interface IUser extends mongoose.Document {
  _id: mongoose.Types.ObjectId
  email?: string
  phone?: string
  telegramId?: number
  name: string
  password?: string
  image?: string
  role?: string
  points: number
  rank: string
  createdAt: Date
  updatedAt: Date
  votes: mongoose.Types.ObjectId[]
  reportsCount: number
  verifiedReportsCount: number
  peopleProtected: number
  badges: string[]
  streak: number
  lastActiveDate: Date
  apiKeys?: {
    key: string;
    name: string;
    createdAt: Date;
    lastUsed?: Date;
    isActive: boolean;
  }[];
}

const UserSchema = new mongoose.Schema<IUser>({
  email: {
    type: String,
    required: false,
    unique: true,
    sparse: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: false,
    unique: true,
    sparse: true,
    trim: true
  },
  telegramId: {
    type: Number,
    required: false,
    unique: true,
    sparse: true
  },
  role: {
    type: String,
    default: 'user'
  },
  image: String,
  reportsCount: {
    type: Number,
    default: 0
  },
  verifiedReportsCount: {
    type: Number,
    default: 0
  },
  peopleProtected: {
    type: Number,
    default: 0
  },
  badges: {
    type: [String],
    default: []
  },
  streak: {
    type: Number,
    default: 0
  },
  lastActiveDate: {
    type: Date,
    default: Date.now
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: false
  },
  points: {
    type: Number,
    default: 0
  },
  rank: {
    type: String,
    enum: ['Новичок', 'Охотник', 'Эксперт', 'Мастер'],
    default: 'Новичок'
  },
  votes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Scam'
  }],
  apiKeys: [{
    key: String,
    name: String,
    createdAt: Date,
    lastUsed: Date,
    isActive: Boolean,
    usage: { type: Number, default: 0 },
    limit: { type: Number, default: 100 } // Бесплатный лимит
  }]
}, {
  timestamps: true
})

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema)
