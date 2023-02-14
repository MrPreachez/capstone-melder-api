const express = require("express");
const router = express.Router();
const fs = require("fs");
const melderController = require("../controllers/melderController");

router.route("/project").post(melderController.addProject);
router.route("/project/:id").get(melderController.getProject);
router.route("/input").post(melderController.addResponse);
router.route("/project/:id").post(melderController.addResult);
router.route("/project/:id/result").get(melderController.getResult);
router.route("/project").get(melderController.getAllProjects);
router.route("/project/:id/all").get(melderController.getAllProjectData);

router.route("/responses/:id").get(melderController.getResponses);

module.exports = router;
