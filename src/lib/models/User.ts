import mongoose from 'mongoose'

export interface IUser extends mongoose.Document {
  _id: mongoose.Types.ObjectId
  email: string
  name: string
  password?: string
  points: number
  rank: string
  createdAt: Date
  updatedAt: Date
  votes: mongoose.Types.ObjectId[] // scam IDs they've voted on
  reportsCount?: number // virtual field for aggregation
  votesCount?: number // virtual field for aggregation
}

const UserSchema = new mongoose.Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
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

// Update rank based on points
UserSchema.pre('save', function(next) {
  if (this.points >= 1000) {
    this.rank = 'Мастер'
  } else if (this.points >= 500) {
    this.rank = 'Эксперт'
  } else if (this.points >= 100) {
    this.rank = 'Охотник'
  } else {
    this.rank = 'Новичок'
  }
  next()
})

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema)
