const logModel = require("../models/logModel");

exports.logError = (plantId, message) => {
  exports.addLogEntry(plantId, message, "error");
};

exports.logWarn = (plantId, message) => {
  exports.addLogEntry(plantId, message, "warn");
};

exports.logInfo = (plantId, message) => {
  exports.addLogEntry(plantId, message);
};

exports.addLogEntry = async (plantId, message, level = "info") => {
  const log = new logModel({
    plantId: plantId,
    message: message,
    level: level,
  });
  await log.save();
};
