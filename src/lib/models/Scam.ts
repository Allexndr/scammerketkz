import mongoose from 'mongoose'

export interface IScam extends mongoose.Document {
  _id: mongoose.Types.ObjectId
  phoneNumber: string
  phoneHash: string // hashed for privacy
  gender: 'male' | 'female' | 'unknown'
  company: string
  representedAs: string
  scamType: string
  region: string
  description: string
  reportedBy: mongoose.Types.ObjectId
  likes: number
  dislikes: number
  voters: mongoose.Types.ObjectId[] // users who voted
  comments: mongoose.Types.ObjectId[]
  isVerified: boolean // auto-calculated based on likes/dislikes ratio
  createdAt: Date
  updatedAt: Date
}

const ScamSchema = new mongoose.Schema<IScam>({
  phoneNumber: {
    type: String,
    required: true
  },
  phoneHash: {
    type: String,
    required: true,
    index: true
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'unknown'],
    default: 'unknown'
  },
  company: {
    type: String,
    required: true,
    trim: true
  },
  representedAs: {
    type: String,
    default: '',
    trim: true,
    maxlength: 200
  },
  scamType: {
    type: String,
    enum: ['phishing', 'vishing', 'smishing', 'impersonation', 'investment', 'loan', 'crypto', 'fake_sale', 'fake_shop', 'rental', 'prize', 'other'],
    default: 'other'
  },
  region: {
    type: String,
    enum: [
      'Алматы', 'Астана', 'Шымкент', 'Актобе', 'Атырау', 'Караганда',
      'Костанай', 'Кызылорда', 'Павлодар', 'Петропавловск', 'Тараз', 'Уральск', 'Усть-Каменогорск', 'other'
    ],
    default: 'other'
  },
  description: {
    type: String,
    required: true,
    maxlength: 1000
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  likes: {
    type: Number,
    default: 0
  },
  dislikes: {
    type: Number,
    default: 0
  },
  voters: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  isVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
})

// Note: Verification status is calculated in the API routes

// Database indexes for performance
ScamSchema.index({ company: 1 })
ScamSchema.index({ createdAt: -1 })
ScamSchema.index({ isVerified: 1 })
ScamSchema.index({ scamType: 1 })
ScamSchema.index({ region: 1 })
ScamSchema.index({ likes: -1 })
ScamSchema.index({ phoneHash: 1 }, { unique: true })

export default mongoose.models.Scam || mongoose.model<IScam>('Scam', ScamSchema)
