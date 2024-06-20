import config from "../config/config.js";
import dayjs from "dayjs";

/**
 * Changes the stage of the plant to "seedling".
 * @param {object} data - The data object containing request data.
 * @returns {object} The update db query.
 */
const seedling = (dates) => {
  const startedOn = dayjs(dates?.startedOn);

  // Calculate new potential harvest date
  const potentialHarvest = startedOn
    .add(config.flowerWeeks, "weeks")
    .format("YYYY-MM-DD");

  return {
    startedOn: `${startedOn.format("YYYY-MM-DD")}T00:00:00`,
    potentialHarvest: `${potentialHarvest}T00:00:00`,
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
    : dayjs().format("YYYY-MM-DD");

  // Calculate new potential harvest date
  const potentialHarvest = dayjs(vegStartedOn)
    .add(config.flowerWeeks, "weeks")
    .format("YYYY-MM-DD");

  return {
    potentialHarvest: `${potentialHarvest}T00:00:00`,
    vegStartedOn: `${vegStartedOn}T00:00:00`,
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
    : dayjs().format("YYYY-MM-DD");

  // Calculate new potential harvest date
  const potentialHarvest = dayjs(flowerStartedOn)
    .add(config.flowerWeeks, "weeks")
    .format("YYYY-MM-DD");

  return {
    potentialHarvest: `${potentialHarvest}T00:00:00`,
    vegStartedOn: `${dates.vegStartedOn}T00:00:00`,
    flowerStartedOn: `${flowerStartedOn}T00:00:00`,
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
    : dayjs().format("YYYY-MM-DD");

  return {
    potentialHarvest: undefined,
    vegStartedOn: `${dates.vegStartedOn}T00:00:00`,
    flowerStartedOn: `${dates.flowerStartedOn}T00:00:00`,
    harvestedOn: `${harvestedOn}T00:00:00`,
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
    ? dayjs(dates.cureStartedOn).format("YYYY-MM-DD")
    : dayjs().format("YYYY-MM-DD");

  return {
    potentialHarvest: undefined,
    vegStartedOn: `${dates.vegStartedOn}T00:00:00`,
    flowerStartedOn: `${dates.flowerStartedOn}T00:00:00`,
    harvestedOn: `${dates.harvestedOn}T00:00:00`,
    cureStartedOn: `${cureStartedOn}T00:00:00`,
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
  archivedOn: new Date().toISOString(),
});

/**
 * Returns the update db query for the specified stage and dates.
 * @param {string} stage - The stage of the plant to update.
 * @param {object} dates - An object containing dates relevant to the stage.
 * @returns {object} The update db query for the specified stage and dates.
 */
export const getNewStageDates = (stage, dates) => {
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
