// Plant routes
import { addLog, getLog, getLogs, notAllowed } from "./log.handlers.js"
import { Router } from "express"

const router = Router()

router
  .get("/", getLogs)
  .get("/:logId", getLog)
  .post("/", addLog)
  .put("/:logId", notAllowed)
  .delete("/:logId", notAllowed)

export default router
