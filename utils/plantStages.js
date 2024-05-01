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
  const startedOn = dates.startedOn
    ? dates.startedOn
    : moment().format("YYYY-MM-DD");

  // Calculate new potential harvest date
  const potentialHarvest = moment(startedOn)
    .add(4, "weeks")
    .format("YYYY-MM-DD");

  return {
    startedOn: startedOn,
    potentialHarvest: potentialHarvest,
    vegStartedOn: undefined,
    flowerStartedOn: undefined,
    harvestedOn: undefined,
    cureStartedOn: undefined,
    archivedOn: undefined,
  };
};

/**
 * Changes the stage of the plant to "veg".
 * @param {object} dates Object containing dates
 * @returns {object} The update db query.
 */
const veg = (dates) => {
  const vegStartedOn = dates.vegStartedOn
    ? dates.vegStartedOn
    : moment().format("YYYY-MM-DD");

  // Calculate new potential harvest date
  const potentialHarvest = moment(vegStartedOn)
    .add(4, "weeks")
    .format("YYYY-MM-DD");

  return {
    potentialHarvest: potentialHarvest,
    vegStartedOn: vegStartedOn,
    flowerStartedOn: undefined,
    harvestedOn: undefined,
    cureStartedOn: undefined,
    archivedOn: undefined,
  };
};

const flower = (dates) => {
  // Set new flower date
  const flowerStartedOn = dates.flowerStartedOn
    ? dates.flowerStartedOn
    : moment().format("YYYY-MM-DD");

  // Calculate new potential harvest date
  const potentialHarvest = moment(flowerStartedOn)
    .add(4, "weeks")
    .format("YYYY-MM-DD");

  return {
    potentialHarvest: potentialHarvest,
    vegStartedOn: dates.vegStartedOn,
    flowerStartedOn: flowerStartedOn,
    harvestedOn: undefined,
    cureStartedOn: undefined,
    archivedOn: undefined,
  };
};

/**
 * Sets the stage of the plant to "harvest" and sets the harvestedOn field
 * to the current date or the provided date.
 *
 * @param {object} data - The data object containing the request data.
 * @returns {object} The update db query.
 */
const harvest = (dates) => {
  const harvestedOn = dates.harvestedOn
    ? dates.harvestedOn
    : moment().format("YYYY-MM-DD");

  return {
    potentialHarvest: undefined,
    vegStartedOn: dates.vegStartedOn,
    flowerStartedOn: dates.flowerStartedOn,
    harvestedOn: harvestedOn,
    cureStartedOn: undefined,
    archivedOn: undefined,
  };
};

/**
 * Sets the stage of the plant to "cure" and sets the cureStartedOn field to the
 * current date or the provided date.
 *
 * @param {object} data - The data object containing the plant document.
 * @returns {object} The updat db query.
 */
const cure = (dates) => {
  const cureStartedOn = dates.cureStartedOn
    ? moment(setData.cureStartedOn).format("YYYY-MM-DD")
    : moment().format("YYYY-MM-DD");

  return {
    potentialHarvest: undefined,
    vegStartedOn: dates.vegStartedOn,
    flowerStartedOn: dates.flowerStartedOn,
    harvestedOn: dates.harvestedOn,
    cureStartedOn: cureStartedOn,
    archivedOn: undefined,
  };
};

/**
 * Sets the status of the plant to "archived" and sets the archivedOn field to the current date.
 * @returns {object} The updated plant document.
 */
const archive = () => ({
  status: "archived",
  potentialHarvest: undefined,
  archivedOn: moment().format("YYYY-MM-DD"),
});
