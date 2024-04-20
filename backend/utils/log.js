const logModel = require("../models/logModel");

exports.addLogEntry = async (plantId, message) => {
  try {
    const log = new logModel({
      plantId: plantId,
      message: message,
    });
    await log.save();
  } catch (err) {
    throw new Error(err.message);
  }
};
