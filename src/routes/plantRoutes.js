// Plant routes

import {
  addLog,
  getLog,
  getLogs,
  notAllowed,
} from '../controllers/logController.js'
import {
  addPlant,
  deletePlant,
  getPlant,
  getPlants,
  updatePlant,
} from '../controllers/plantController.js'
import { Router } from 'express'

const router = new Router()

router
  .get('/', getPlants)
  .get('/:plantId', getPlant)
  .post('/', addPlant)
  .put('/:plantId', updatePlant)
  .delete('/:plantId', deletePlant)

  // Plant log routes
  .get('/:plantId/logs', getLogs)
  .get('/:plantId/logs/:logId', getLog)
  .post('/:plantId/logs/', addLog)
  .put('/:plantId/logs/', notAllowed)
  .delete('/:plantId', notAllowed)

export default router
