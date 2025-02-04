/** @file Contains routing logic for plants. */
// Plant routes

import {
  addPlant,
  deletePlant,
  getPlant,
  getPlants,
  updatePlant,
} from "./plants.handlers.js"
import { Router } from "express"

const router = Router()

router
  .get("/", getPlants)
  .get("/:plantId", getPlant)
  .post("/", addPlant)
  .put("/:plantId", updatePlant)
  .delete("/:plantId", deletePlant)

export default router
