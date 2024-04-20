// Plant routes
const express = require("express");
const router = express.Router();
const plantController = require("../controllers/plantController");
const logController = require("../controllers/logController");

router
  // Plant routes
  .get("/", plantController.getPlants)
  .get("/:plantId", plantController.getPlant)
  .post("/", plantController.addPlant)
  .put("/:plantId", plantController.updatePlant)
  .delete("/:plantId", plantController.deletePlant)

  // Plant log routes
  .get("/:plantId/logs", logController.getLogs)
  .get("/:plantId/logs/:logId", logController.getLog)
  .post("/:plantId/logs/", logController.addLog);

module.exports = router;
