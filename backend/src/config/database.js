const mongoose = require("mongoose");
const { env } = require("./env");

const connectDatabase = async () => {
  console.log("[startup] Connecting to MongoDB...");
  await mongoose.connect(env.mongoUri);
  console.log(`[startup] MongoDB connected (${mongoose.connection.host})`);
};

module.exports = connectDatabase;
