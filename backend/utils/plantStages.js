const plantModel = require("../models/plantModel");
const moment = require("moment");

exports.getStageData = async (data) => {
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
const toSeedling = (data) => {
  const startDate = data.startedOn
    ? moment(setData.startedOn).format("YYYY-MM-DD")
    : moment().format("YYYY-MM-DD");

  // Calculate new potential harvest date
  const potentialHarvest = moment(startDate)
    .add(4, "weeks")
    .format("YYYY-MM-DD");

  const setData = {
    stage: "seedling",
    startedOn: startDate,
    potentialHarvest: potentialHarvest,
  };

  // Unset veg, flower, harvested, and cure start dates
  const unsetData = {
    vegStartedOn: "",
    flowerStartedOn: "",
    harvestedOn: "",
    cureStartedOn: "",
    archivedOn: "",
  };

  return { $unset: unsetData, $set: setData };
};

/**
 * Changes the stage of the plant to "veg".
 * @param {object} data - The data object containing the request data.
 * @returns {object} The update db query.
 */
const toVeg = (data) => {
  const startDate = data.vegStartedO
    ? moment(setData.vegStartedOn).format("YYYY-MM-DD")
    : moment().format("YYYY-MM-DD");

  // Calculate new potential harvest date
  const potentialHarvest = moment(startDate)
    .add(4, "weeks")
    .format("YYYY-MM-DD");

  const setData = {
    stage: "veg",
    vegStartedOn: startDate,
    potentialHarvest: potentialHarvest,
  };

  // Unset flower, harvested, and cure start dates
  const unsetData = {
    flowerStartedOn: "",
    harvestedOn: "",
    cureStartedOn: "",
    archivedOn: "",
  };

  return { $unset: unsetData, $set: setData };
};

const toFlower = (data) => {
  const startDate = data.flowerStartedOn
    ? moment(setData.flowerStartedOn).format("YYYY-MM-DD")
    : moment().format("YYYY-MM-DD");

  // Calculate new potential harvest date
  const potentialHarvest = moment(startDate)
    .add(4, "weeks")
    .format("YYYY-MM-DD");

  const setData = {
    stage: "flower",
    flowerStartedOn: startDate,
    potentialHarvest: potentialHarvest,
  };

  // Unset harvest and cure dates
  const unsetData = {
    harvestedOn: "",
    cureStartedOn: "",
    archivedOn: "",
  };

  return { $unset: unsetData, $set: setData };
};

/**
 * Sets the stage of the plant to "harvest" and sets the harvestedOn field
 * to the current date or the provided date.
 *
 * @param {object} data - The data object containing the request data.
 * @returns {object} The update db query.
 */
const toHarvest = (data) => {
  const startDate = data.harvestedOn
    ? moment(setData.harvestedOn).format("YYYY-MM-DD")
    : moment().format("YYYY-MM-DD");

  const setData = {
    stage: "harvest",
    harvestedOn: startDate,
  };

  // Unset potential harvest and cure start dates
  const unsetData = {
    potentialHarvest: "",
    cureStartedOn: "",
    archivedOn: "",
  };

  return { $unset: unsetData, $set: setData };
};

/**
 * Sets the stage of the plant to "cure" and sets the cureStartedOn field to the
 * current date or the provided date.
 *
 * @param {object} data - The data object containing the plant document.
 * @returns {object} The updat db query.
 */
const toCure = (data) => {
  const startDate = data.cureStartedOn
    ? moment(setData.cureStartedOn).format("YYYY-MM-DD")
    : moment().format("YYYY-MM-DD");

  const setData = {
    stage: "cure",
    cureStartedOn: startDate,
  };

  // Unset archived date
  const unsetData = {
    archivedOn: "",
  };

  return { $set: setData, $unset: unsetData };
};

/**
 * Sets the status of the plant to "archived" and sets the archivedOn field to the current date.
 * @returns {object} The updated plant document.
 */
const toArchive = () => {
  const setData = {
    status: "archived",
    archivedOn: moment().format("YYYY-MM-DD"),
  };

  return { $set: setData };
};
