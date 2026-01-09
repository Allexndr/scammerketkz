import mongoose from 'mongoose'

export interface IComment extends mongoose.Document {
  scamId: mongoose.Types.ObjectId
  userId: mongoose.Types.ObjectId
  userName: string // Denormalized for speed
  text: string
  createdAt: Date
}

const CommentSchema = new mongoose.Schema<IComment>({
  scamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Scam',
    required: true,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true,
    maxlength: 500
  }
}, {
  timestamps: true
})

export default mongoose.models.Comment || mongoose.model<IComment>('Comment', CommentSchema)
