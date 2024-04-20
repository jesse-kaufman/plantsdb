// Plant routes
const express = require("express");
const router = express.Router();
const logController = require("../controllers/logController");

router
  // Log routes
  .get("/", logController.getLogs)
  .get("/:plantId", logController.getLog)
  .post("/", logController.addLog);
//.delete("/:plantId", logController.deleteLog);

module.exports = router;
