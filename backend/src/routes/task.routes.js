const express = require("express");
const taskController = require("../controllers/task.controller");

const router = express.Router();

router.get("/", taskController.getTasks);
router.get("/today", taskController.getTodayTasks);
router.patch("/:id/complete", taskController.markTaskComplete);

module.exports = router;
