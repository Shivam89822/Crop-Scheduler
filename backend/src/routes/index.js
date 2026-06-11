const express = require("express");

const healthRoutes = require("./health.routes");
const farmRoutes = require("./farm.routes");
const cropRoutes = require("./crop.routes");
const taskRoutes = require("./task.routes");

const router = express.Router();

router.use("/health", healthRoutes);
router.use("/farms", farmRoutes);
router.use("/crops", cropRoutes);
router.use("/tasks", taskRoutes);

module.exports = router;
