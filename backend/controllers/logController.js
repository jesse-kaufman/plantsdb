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
  } catch (err) {
    res.status(500).json({ error: err.message });
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

  //
  // Get all matching plants
  //
  try {
    const logs = await logModel.find({
      plantId: req.params.plantId,
    });
    res.status(200).json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
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
  // Save the new log entry
  //
  try {
    const log = new logModel(newLog);
    await log.save();
    res.status(201).json(log);
  } catch (err) {
    res.status(500).json({ error: err.message });
    return;
  }
};

/**
 * Deletes an existing log from the database
 *
 * @param {*} req The request object
 * @param {*} res The response object
 */
exports.deleteLog = async (req, res) => {
  try {
    // Find and delete the plant
    const log = await logModel.updateOne(
      { _id: req.params.logId },
      { status: "inactive" }
    );
    res.status(200).json(log);
  } catch (err) {
    res.status(500).json({ error: err.message });
    return;
  }
};
