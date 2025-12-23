import mongoose from 'mongoose'

export interface IComment extends mongoose.Document {
  _id: mongoose.Types.ObjectId
  scamId: mongoose.Types.ObjectId
  userId: mongoose.Types.ObjectId
  text: string
  likes: number
  dislikes: number
  createdAt: Date
  updatedAt: Date
}

const CommentSchema = new mongoose.Schema<IComment>({
  scamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Scam',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  text: {
    type: String,
    required: true,
    maxlength: 500
  },
  likes: {
    type: Number,
    default: 0
  },
  dislikes: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
})

export default mongoose.models.Comment || mongoose.model<IComment>('Comment', CommentSchema)
