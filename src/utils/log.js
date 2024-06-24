import LogModel from '../models/logModel.js'

export const addLogEntry = async (plantId, message, level = 'info') => {
  const log = new LogModel({
    plantId: plantId,
    message: message,
    level: level,
  })
  await log.save()
}

export const logError = async (plantId, message) => {
  await addLogEntry(plantId, message, 'error')
}

export const logWarn = async (plantId, message) => {
  await addLogEntry(plantId, message, 'warn')
}

export const logInfo = async (plantId, message) => {
  await addLogEntry(plantId, message)
}
