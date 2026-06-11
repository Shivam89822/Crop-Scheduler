const dotenv = require("dotenv");

dotenv.config();

const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 5000,
  mongoUri: process.env.MONGODB_URI || ""
};

if (!env.mongoUri) {
  throw new Error("MONGODB_URI is missing in environment variables");
}

module.exports = { env };
