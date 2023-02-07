const express = require("express");
const router = express.Router();
const fs = require("fs");
const melderController = require("../controllers/melderController");

router.route("/project").post(melderController.addProject);
router.route("/project/:id").get(melderController.getProject);
router.route("/input").post(melderController.addResponse);
router.route("/submit_project/:id").post(melderController.addResult);
router.route("/project/:id/results").get(melderController.getResult);

module.exports = router;
