// Plant routes
const express = require("express");
const router = express.Router();

const plantController = require("../controllers/plantController");

router
  .get("/", plantController.getPlants)
  .post("/", plantController.addPlant)
  .put("/:id", plantController.updatePlant)
  .delete("/:id", plantController.deletePlant);

module.exports = router;
