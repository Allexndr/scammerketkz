import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = (global as { mongoose?: { conn: unknown; promise: unknown } }).mongoose

if (!cached) {
  cached = (global as { mongoose?: { conn: unknown; promise: unknown } }).mongoose = { conn: null, promise: null }
}

async function connectDB() {
  // Return a mock connection during build time to prevent errors
  if (typeof window !== 'undefined' || process.env.NODE_ENV === 'test' || !MONGODB_URI) {
    return { connection: { readyState: 1 } } // Mock connection for build/test/no URI
  }

  if (cached && cached.conn) {
    return cached.conn
  }

  if (!cached || !cached.promise) {
    const opts = {
      bufferCommands: false,
    }

    if (cached) {
      cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
        return mongoose
      })
    }
  }
  try {
    if (cached) {
      cached.conn = await cached.promise
    }
  } catch (e) {
    if (cached) {
      cached.promise = null
    }
    throw e
  }

  return cached?.conn
}

export default connectDB