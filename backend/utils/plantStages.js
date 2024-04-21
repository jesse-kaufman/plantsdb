const moment = require("moment");

/**
 * Returns the update db query for the specified stage and dates.
 * @param {string} stage - The stage of the plant to update.
 * @param {object} dates - An object containing dates relevant to the stage.
 * @returns {object} The update db query for the specified stage and dates.
 */
exports.getNewStageDates = (stage, dates) => {
  switch (stage) {
    case "seedling":
      return seedling(dates);
    case "veg":
      return veg(dates);
    case "flower":
      return flower(dates);
    case "harvest":
      return harvest(dates);
    case "cure":
      return cure(dates);
    case "archive":
      return archive(dates);
    default:
      throw new Error("Invalid stage");
  }
};

/**
 * Changes the stage of the plant to "seedling".
 * @param {object} data - The data object containing request data.
 * @returns {object} The update db query.
 */
const seedling = (dates) => {
  const startDate = dates.startedOn
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
 * @param {object} dates Object containing dates
 * @returns {object} The update db query.
 */
const veg = (dates) => {
  const startDate = dates.vegStartedO
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

const flower = (dates) => {
  const startDate = dates.flowerStartedOn
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
const harvest = (dates) => {
  const startDate = dates.harvestedOn
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
const cure = (dates) => {
  const startDate = dates.cureStartedOn
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
const archive = () => {
  const setData = {
    status: "archived",
    archivedOn: moment().format("YYYY-MM-DD"),
  };

  return { $set: setData };
};
