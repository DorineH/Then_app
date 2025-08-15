// import mongoose from 'mongoose'

// const MONGODB_URI = process.env.MONGODB_URI!

// if (!MONGODB_URI) {
//   throw new Error('Please define the MONGODB_URI environment variable inside .env.local')
// }

// declare global {
//   let mongoose:
//     | {
//         conn: typeof mongoose | null
//         promise: Promise<typeof mongoose> | null
//       }
//     | undefined
// }

// const globalForMongoose = globalThis as typeof globalThis & {
//   mongoose?: {
//     conn: typeof mongoose | null
//     promise: Promise<typeof mongoose> | null
//   }
// }

// const cached = globalForMongoose.mongoose || { conn: null, promise: null }

// export async function connectToDatabase() {
//   if (cached.conn) return cached.conn

//   if (!cached.promise) {
//     cached.promise = mongoose
//       .connect(MONGODB_URI, {
//         dbName: 'then',
//         bufferCommands: false,
//       })
//       .then((mongoose) => mongoose)
//   }

//   cached.conn = await cached.promise
//   globalForMongoose.mongoose = cached

//   return cached.conn
// }
