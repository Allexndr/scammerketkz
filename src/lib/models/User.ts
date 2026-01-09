```typescript
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
  votes: mongoose.Types.ObjectId[] // scam IDs they've voted on
  reportsCount: number
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
    sparse: true, // Allow multiple null/undefined values
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
  name: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: false // for social auth
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
  }]
}, {
  timestamps: true
})

// Note: Rank is updated in API routes

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema)
