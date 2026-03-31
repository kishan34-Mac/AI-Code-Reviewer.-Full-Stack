import mongoose from "mongoose";

const DEFAULT_MONGODB_URI = "mongodb://127.0.0.1:27017/ai-code-reviewer";

export async function connectToDatabase() {
  const mongoUri = process.env.MONGODB_URI || DEFAULT_MONGODB_URI;
  const dbName = process.env.MONGODB_DB_NAME;

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  await mongoose.connect(mongoUri, dbName ? { dbName } : {});

  return mongoose.connection;
}
