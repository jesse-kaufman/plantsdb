import LogModel from '../models/logModel.js'
import { getChangeList } from './plantChangeService.js'

/**
 * Creates a new log entry listing the changes made to the plant
 *
 * @param {*} changes
 */
export const logChanges = async function (changes) {
  const changeList = getChangeList(changes, this.$locals.oldPlant)
  await LogModel.log(this._id, `Updated plant:\n• ${changeList.join('\n• ')}`)
}

export const logError = async function (message) {
  await LogModel.logError(this._id, message, 'error')
}

export const logWarning = async function (message) {
  await LogModel.logWarning(this._id, message, 'warn')
}

export const log = async function (message) {
  await LogModel.logInfo(this._id, message)
}

export const logInfo = async (message) => {
  await LogModel.logInfo(this._id, message)
}

export default { logChanges, logError, logInfo, logWarning, log }
