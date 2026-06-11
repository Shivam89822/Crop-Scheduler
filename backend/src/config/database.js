const mongoose = require("mongoose");
const { env } = require("./env");

const connectDatabase = async () => {
  await mongoose.connect(env.mongoUri);
  console.log("MongoDB connected");
};

module.exports = connectDatabase;
