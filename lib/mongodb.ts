import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

async function connectDB(): Promise<typeof mongoose> {
  const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;

  if (mongoUri) {
    process.env.MONGODB_URI = mongoUri;
  }

  if (!mongoUri) {
    try {
      const memoryServer = await MongoMemoryServer.create();
      process.env.MONGODB_URI = memoryServer.getUri();
    } catch {
      process.env.MONGODB_URI = "mongodb://127.0.0.1:27017/splitease";
    }
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/splitease", opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;
