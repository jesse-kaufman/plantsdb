const logModel = require("../models/logModel");

/**
 * Gets an existing plant log entry from the database
 *
 * @param {*} req The request object
 * @param {*} res The response object
 */
exports.getLog = async (req, res) => {
  try {
    //
    // Find the plant log entry
    //
    const log = await logModel.findById({
      _id: req.params.logId,
    });
    res.status(200).json(log);
  } catch (error) {
    res.status(500).json({ error: error.message });
    return;
  }
};

/**
 * Gets all the log entries for a plant from the database
 *
 * @param {*} req The request object
 * @param {*} res The response object
 */
exports.getLogs = async (req, res) => {
  //
  // Filter by statuses requested
  //
  if (!req.params.plantId) {
    res.status(500).json({ error: "No plantId provided." });
    return;
  }

  const plantId = req.params.statuses;

  //
  // Get all matching plants
  //
  try {
    const logs = await logModel.find({
      id: plantId,
    });
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
    return;
  }
};

/**
 * Adds a new plant log entry to the database
 *
 * @param {*} req The request object
 * @param {*} res The response object
 */
exports.addLog = async (req, res) => {
  // XXX: Validate the input here
  const plantId = req.params.plantId;
  const newLog = {
    plantId: plantId,
    message: req.body.message,
  };

  //
  // Save the new plant log entry
  //
  try {
    const log = new logModel(newLog);
    await log.save();
    res.status(201).json(log);
  } catch (error) {
    res.status(500).json({ error: error.message });
    return;
  }
};
