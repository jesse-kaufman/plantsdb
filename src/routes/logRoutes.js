// Plant routes
import {
  addLog,
  getLog,
  getLogs,
  notAllowed,
} from "../controllers/logController.js";
import { Router } from "express";

const router = new Router();

router
  .get("/", getLogs)
  .get("/:logId", getLog)
  .post("/", addLog)
  .put("/:logId", notAllowed)
  .delete("/:logId", notAllowed);

export default router;
