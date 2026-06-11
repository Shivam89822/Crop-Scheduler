const express = require("express");
const cropController = require("../controllers/crop.controller");
const validateCreateCrop = require("../validators/crop.validator");

const router = express.Router();

router.post("/", validateCreateCrop, cropController.createCrop);
router.get("/:id", cropController.getCropById);

module.exports = router;
