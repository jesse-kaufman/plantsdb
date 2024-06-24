import LogModel from '../models/logModel.js'
import { httpCodes } from '../config/config.js'

/**
 * Gets an existing plant log entry from the database
 *
 * @param {*} req The request object
 * @param {*} res The response object
 */
export const getLog = async (req, res) => {
  try {
    //
    // Find the plant log entry
    //
    const log = await LogModel.findById({
      _id: req.params.logId,
    })
    res.status(httpCodes.OK).json(log)
  } catch (err) {
    res.status(httpCodes.SERVER_ERROR).json({ error: err.message })
  }
}

/**
 * Gets all the log entries for a plant from the database
 *
 * @param {*} req The request object
 * @param {*} res The response object
 */
export const getLogs = async (req, res) => {
  //
  // Filter by statuses requested
  //
  if (!req.params.plantId) {
    res.status(httpCodes.SERVER_ERROR).json({ error: 'No plantId provided.' })
    return
  }

  //
  // Get all matching plants
  //
  try {
    const logs = await find({
      plantId: req.params.plantId,
    })
    res.status(httpCodes.OK).json(logs)
  } catch (err) {
    res.status(httpCodes.SERVER_ERROR).json({ error: err.message })
  }
}

/**
 * Adds a new plant log entry to the database
 *
 * @param {*} req The request object
 * @param {*} res The response object
 */
export const addLog = async (req, res) => {
  // XXX: Validate the input here
  const plantId = req.params.plantId
  const newLog = {
    plantId: plantId,
    message: req.body.message,
  }

  //
  // Save the new log entry
  //
  try {
    const log = new LogModel(newLog)
    await log.save()
    res.status(httpCodes.CREATED).json(log)
  } catch (err) {
    res.status(httpCodes.SERVER_ERROR).json({ error: err.message })
  }
}

/**
 * Returns an HTTP httpCodes.NOT_ALLOWED: "Method not allowed" error message
 *
 * @param {*} req The request object
 * @param {*} res The response object
 */
export const notAllowed = (req, res) => {
  switch (req.method) {
    case 'DELETE':
      res
        .status(httpCodes.NOT_ALLOWED)
        .json({ error: 'Deleting log entries is prohibited.' })
      return
    case 'PUT':
      res
        .status(httpCodes.NOT_ALLOWED)
        .json({ error: 'Updating log entries is prohibited.' })
  }
}
