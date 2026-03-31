import mongoose from "mongoose";

const DEFAULT_MONGODB_URI = "mongodb://127.0.0.1:27017/ai-code-reviewer";

function normalizeMongoUri(uri: string) {
  return uri
    .trim()
    .replace(/\.mongodb\.net\.(?=\/|\?|$)/, ".mongodb.net");
}

export async function connectToDatabase() {
  const mongoUri = normalizeMongoUri(
    process.env.MONGODB_URI || DEFAULT_MONGODB_URI,
  );
  const dbName = process.env.MONGODB_DB_NAME;

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  try {
    await mongoose.connect(mongoUri, dbName ? { dbName } : {});
  } catch (error) {
    const authError =
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === 8000;

    if (authError) {
      console.error(
        "MongoDB Atlas authentication failed. Check the Render MONGODB_URI username, password, and database user permissions.",
      );
    }

    throw error;
  }

  return mongoose.connection;
}
