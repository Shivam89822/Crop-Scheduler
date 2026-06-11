const app = require("./app");
const { env } = require("./config/env");
const connectDatabase = require("./config/database");

const startServer = async () => {
  try {
    console.log(`[startup] Environment: ${env.nodeEnv}`);
    console.log(`[startup] Port: ${env.port}`);
    await connectDatabase();

    const server = app.listen(env.port, () => {
      console.log(`[startup] API server running at http://localhost:${env.port}`);
      console.log("[startup] Health check available at /api/health");
    });

    const shutdown = (signal) => {
      console.log(`[shutdown] Received ${signal}. Closing server...`);
      server.close(() => {
        console.log("[shutdown] HTTP server closed");
        mongooseDisconnect();
      });
    };

    const mongooseDisconnect = async () => {
      try {
        const mongoose = require("mongoose");
        await mongoose.connection.close();
        console.log("[shutdown] MongoDB connection closed");
        process.exit(0);
      } catch (error) {
        console.error("[shutdown] Error while closing MongoDB connection:", error.message);
        process.exit(1);
      }
    };

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));
  } catch (error) {
    console.error("[startup] Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
