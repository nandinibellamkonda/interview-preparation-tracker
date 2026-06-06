const mongoose = require("mongoose");
const logger = require("../utils/logger");

const connectDatabase = async () => {
  const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
  const source = process.env.MONGO_URI ? 'MONGO_URI' : process.env.MONGODB_URI ? 'MONGODB_URI' : null;

  if (!uri) {
    logger.error("CRITICAL: MONGO_URI / MONGODB_URI is missing. Server cannot start.");
    process.exit(1); // stop app immediately
  }

  logger.info(`MongoDB URI source: ${source}`);

  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 10,
    });

    logger.info("MongoDB connected successfully ✔");

    mongoose.connection.on("error", (err) => {
      logger.error("MongoDB runtime error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      logger.warn("MongoDB disconnected ⚠");
    });

    return mongoose;
  } catch (error) {
    logger.error("MongoDB connection failed ❌:", error.message);
    process.exit(1); // IMPORTANT: prevent server from running without DB
  }
};

module.exports = connectDatabase;
