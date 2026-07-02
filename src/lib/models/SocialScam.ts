import mongoose, { Schema, Document, Model } from 'mongoose'

export interface ISocialScam extends Document {
  platform: string // instagram, telegram, tiktok, whatsapp, threads, youtube, facebook, kaspi, satu, olx, market, flip
  platformType: 'social' | 'marketplace'
  category: string // shop, freelancer, seller, blogger
  username: string // @nickname or store name
  profileUrl: string // link to profile/store
  displayName: string // real name or store name
  description: string // detailed complaint
  region: string
  amountScammed?: number // how much money was lost (in KZT)
  evidenceUrls: string[] // screenshots URLs
  tags: string[] // e.g. "не отправил товар", "кинул на деньги"
  victimsCount: number // how many people reported being scammed
  likes: number // confirmations
  dislikes: number // disagreements
  isVerified: boolean
  status: string // Pending, Active, Resolved
  reportedBy: mongoose.Types.ObjectId | string
  voters: (mongoose.Types.ObjectId | string)[]
  comments: {
    userId: mongoose.Types.ObjectId | string
    userName: string
    text: string
    createdAt: Date
  }[]
  createdAt: Date
  updatedAt: Date
}

const SocialScamSchema = new Schema<ISocialScam>(
  {
    platform: {
      type: String,
      required: true,
      enum: [
        'instagram', 'telegram', 'tiktok', 'whatsapp', 'threads',
        'youtube', 'facebook', // social
        'kaspi', 'satu', 'olx', 'market', 'flip', // marketplaces
        'other',
      ],
      index: true,
    },
    platformType: {
      type: String,
      required: true,
      enum: ['social', 'marketplace'],
      default: 'social',
      index: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['shop', 'freelancer', 'seller', 'blogger', 'other'],
      index: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    profileUrl: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    displayName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: true,
      maxlength: 3000,
    },
    region: {
      type: String,
      default: 'other',
      index: true,
    },
    amountScammed: {
      type: Number,
      default: 0,
      min: 0,
    },
    evidenceUrls: {
      type: [String],
      default: [],
      validate: {
        validator: (v: string[]) => v.length <= 5,
        message: 'Максимум 5 файлов',
      },
    },
    tags: {
      type: [String],
      default: [],
      validate: {
        validator: (v: string[]) => v.length <= 10,
        message: 'Максимум 10 тегов',
      },
    },
    victimsCount: {
      type: Number,
      default: 1,
      min: 1,
    },
    likes: {
      type: Number,
      default: 0,
      min: 0,
    },
    dislikes: {
      type: Number,
      default: 0,
      min: 0,
    },
    isVerified: {
      type: Boolean,
      default: false,
      index: true,
    },
    status: {
      type: String,
      default: 'Active',
      enum: ['Pending', 'Active', 'Resolved'],
    },
    reportedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    voters: {
      type: [Schema.Types.Mixed],
      default: [],
    },
    comments: [
      {
        userId: { type: Schema.Types.Mixed },
        userName: { type: String, required: true },
        text: { type: String, required: true, maxlength: 1000 },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
)

// Indexes for performance
SocialScamSchema.index({ platform: 1, category: 1, isVerified: -1 })
SocialScamSchema.index({ victimsCount: -1 })
SocialScamSchema.index({ likes: -1 })
SocialScamSchema.index({ createdAt: -1 })
SocialScamSchema.index({ username: 'text', displayName: 'text', description: 'text' })

export default (mongoose.models.SocialScam as Model<ISocialScam>) ||
  mongoose.model<ISocialScam>('SocialScam', SocialScamSchema)
