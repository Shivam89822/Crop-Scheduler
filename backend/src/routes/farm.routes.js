const express = require("express");
const farmController = require("../controllers/farm.controller");
const validateCreateFarm = require("../validators/farm.validator");

const router = express.Router();

router.post("/", validateCreateFarm, farmController.createFarm);
router.get("/", farmController.getFarms);

module.exports = router;
