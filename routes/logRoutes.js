// Plant routes
const express = require("express");
const router = express.Router();
const logController = require("../controllers/logController");

router
  // Log routes
  .get("/", logController.getLogs)
  .get("/:logId", logController.getLog)
  .post("/", logController.addLog)
  .put("/:logId", logController.notAllowed)
  .delete("/:logId", logController.notAllowed);

module.exports = router;
