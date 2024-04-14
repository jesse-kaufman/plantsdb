const { connections } = require("mongoose");
const plantModel = require("../models/plantModel");
const moment = require("moment");

exports.generatePlantId = async (name) => {
  var newPlantId = "";
  name.split(" ").forEach((part) => {
    newPlantId += part.charAt(0).toUpperCase();
  });
  newPlantId = newPlantId.trim();

  try {
    const count = await plantModel.countDocuments({
      status: "active",
      plantId: { $regex: "^" + newPlantId + "\\-\\d" },
    });
    return newPlantId + "-" + (count + 1);
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.changeStage = async (data) => {
  switch (data.stage) {
    case "seedling":
      return toSeedling(data);
    case "veg":
      return toVeg(data);
    case "flower":
      return toFlower(data);
    case "harvest":
      return toHarvest(data);
    case "cure":
      return toCure(data);
    case "archive":
      return toArchive(data);
    default:
      throw new Error("Invalid stage");
  }
};

/**
 * Changes the stage of the plant to "seedling".
 * @param {object} data - The data object containing request data.
 * @returns {object} The update db query.
 */
function toSeedling(data) {
  const startDate = data.dateStarted
    ? moment(setData.dateStarted).format("YYYY-MM-DD")
    : moment().format("YYYY-MM-DD");

  // Calculate new potential harvest date
  const potentialHarvest = moment(startDate)
    .add(4, "weeks")
    .format("YYYY-MM-DD");

  const setData = {
    stage: "seedling",
    dateStarted: startDate,
    potentialHarvest: potentialHarvest,
  };

  // Unset veg, flower, harvested, and cure start dates
  const unsetData = {
    dateVegStarted: "",
    dateFlowerStarted: "",
    dateHarvested: "",
    dateCureStarted: "",
    dateArchived: "",
  };

  return { $unset: unsetData, $set: setData };
}

/**
 * Changes the stage of the plant to "veg".
 * @param {object} data - The data object containing the request data.
 * @returns {object} The update db query.
 */
function toVeg(data) {
  const startDate = data.dateVegStarted
    ? moment(setData.dateVegStarted).format("YYYY-MM-DD")
    : moment().format("YYYY-MM-DD");

  // Calculate new potential harvest date
  const potentialHarvest = moment(startDate)
    .add(4, "weeks")
    .format("YYYY-MM-DD");

  const setData = {
    stage: "veg",
    dateVegStarted: startDate,
    potentialHarvest: potentialHarvest,
  };

  // Unset flower, harvested, and cure start dates
  const unsetData = {
    dateFlowerStarted: "",
    dateHarvested: "",
    dateCureStarted: "",
    dateArchived: "",
  };

  return { $unset: unsetData, $set: setData };
}

function toFlower(data) {
  const startDate = data.dateFlowerStarted
    ? moment(setData.dateFlowerStarted).format("YYYY-MM-DD")
    : moment().format("YYYY-MM-DD");

  // Calculate new potential harvest date
  const potentialHarvest = moment(startDate)
    .add(4, "weeks")
    .format("YYYY-MM-DD");

  const setData = {
    stage: "flower",
    dateFlowerStarted: startDate,
    potentialHarvest: potentialHarvest,
  };

  // Unset harvest and cure dates
  const unsetData = {
    dateHarvested: "",
    dateCureStarted: "",
    dateArchived: "",
  };

  return { $unset: unsetData, $set: setData };
}

/**
 * Sets the stage of the plant to "harvest" and sets the dateHarvested field to the current date or the provided date.
 * @param {object} data - The data object containing the request data.
 * @returns {object} The update db query.
 */
function toHarvest(data) {
  const startDate = data.dateHarvested
    ? moment(setData.dateHarvested).format("YYYY-MM-DD")
    : moment().format("YYYY-MM-DD");

  const setData = {
    stage: "harvest",
    dateHarvested: startDate,
  };

  // Unset potential harvest and cure start dates
  const unsetData = {
    potentialHarvest: "",
    dateCureStarted: "",
    dateArchived: "",
  };

  return { $unset: unsetData, $set: setData };
}

/**
 * Sets the stage of the plant to "cure" and sets the dateCureStarted field to the current date or the provided date.
 * @param {object} data - The data object containing the plant document.
 * @returns {object} The updat db query.
 */
function toCure(data) {
  const startDate = data.dateCureStarted
    ? moment(setData.dateCureStarted).format("YYYY-MM-DD")
    : moment().format("YYYY-MM-DD");

  const setData = {
    stage: "cure",
    dateCureStarted: startDate,
  };

  // Unset archived date
  const unsetData = {
    dateArchived: "",
  };

  return { $set: setData };
}

/**
 * Sets the status of the plant to "archived" and sets the dateArchived field to the current date.
 * @param {object} data - The data object containing the plant document.
 * @returns {object} The updated plant document.
 */
function toArchive(data) {
  const setData = {
    status: "archived",
    dateArchived: moment().format("YYYY-MM-DD"),
  };

  return { $set: setData };
}
