/**
 * @file Contains logic for settings dates when changing plant stages.
 * @typedef {import("../plants.@types.js/index.js").StageDates} StageDates
 */

import * as config from "../plants.constants.js"
import dayjs from "dayjs"

// Object to hold the stage-specific methods
const getStageDates = {}

/**
 * Returns the dates for a plant being marked as seedling.
 * @param {StageDates} dates - Dates sent via API request.
 * @returns {StageDates} The updated dates for a seedling.
 */
getStageDates.seedling = (dates) => {
  const startedOn = dayjs(dates?.startedOn)
  // Get number of weeks to add to start date
  const weeksToAdd = config.seedlingWeeks + config.vegWeeks + config.flowerWeeks
  // Add weeks to start date to get new potential harvest
  const potentialHarvest = dayjs(startedOn).add(weeksToAdd, "weeks")

  /*
    - Set started-on date and calculated potential harvest date
    - Unset vegStartDate, flowerStartedOn, harvestedOn, curesStartedOn, and archivedOn fields
    - Leave the rest as-is
  */
  return {
    startedOn: `${startedOn.format("YYYY-MM-DD")}T00:00:00`,
    potentialHarvest: `${potentialHarvest.format("YYYY-MM-DD")}T00:00:00`,
    vegStartedOn: undefined,
    flowerStartedOn: undefined,
    harvestedOn: undefined,
    cureStartedOn: undefined,
    archivedOn: undefined,
  }
}

/**
 * Returns the dates for a plant starting veg stage.
 * @param {StageDates} dates - Dates sent via API request.
 * @returns {StageDates} The updated dates for a plant starting veg.
 */
getStageDates.veg = (dates) => {
  // Get dayjs date object, defaulting to today if dates.vegStartedOn is undefined
  const vegStartedOn = dayjs(dates?.vegStartedOn)
  // Calculate number of weeks to add to veg start date
  const weeksToAdd = config.vegWeeks + config.flowerWeeks
  // Add weeks to veg start date to get new potential harvest
  const potentialHarvest = vegStartedOn.add(weeksToAdd, "weeks")

  /*
    - Set veg start date and calculated potential harvest date
    - Unset flowerStartedOn, harvestedOn, curesStartedOn, and archivedOn fields
    - Leave the rest as-is
  */
  return {
    ...dates,
    vegStartedOn: `${vegStartedOn.format("YYYY-MM-DD")}T00:00:00`,
    potentialHarvest: `${potentialHarvest.format("YYYY-MM-DD")}T00:00:00`,
    flowerStartedOn: undefined,
    harvestedOn: undefined,
    cureStartedOn: undefined,
    archivedOn: undefined,
  }
}

/**
 * Returns the dates for a plant starting flower stage.
 * @param {StageDates} dates - Dates sent via API request.
 * @returns {StageDates} The updated dates for a plant starting flower.
 */
getStageDates.flower = (dates) => {
  // Get dayjs date object, defaulting to today if dates.flowerStartedOn is undefined
  const flowerStartedOn = dayjs(dates?.flowerStartedOn)
  // Add weeks to flower start date to get new potential harvest
  const potentialHarvest = flowerStartedOn.add(config.flowerWeeks, "weeks")

  /*
    - Set flower start date and calculated potential harvest date
    - Unset harvestedOn, curesStartedOn, and archivedOn fields
    - Leave the rest as-is
  */
  return {
    ...dates,
    potentialHarvest: `${potentialHarvest.format("YYYY-MM-DD")}T00:00:00`,
    flowerStartedOn: `${flowerStartedOn.format("YYYY-MM-DD")}T00:00:00`,
    harvestedOn: undefined,
    cureStartedOn: undefined,
    archivedOn: undefined,
  }
}

/**
 * Returns the dates for a plant being marked as harvested.
 * @param {StageDates} dates - Dates sent via API request.
 * @returns {StageDates} The updated dates for a plant being marked as harvested.
 */
getStageDates.harvested = (dates) => {
  // Get dayjs date object, defaulting to today if dates.harvestedOn is undefined
  const harvestedOn = dayjs(dates?.harvestedOn)

  return {
    ...dates,
    harvestedOn: `${harvestedOn.format("YYYY-MM-DD")}T00:00:00`,
    potentialHarvest: undefined,
    cureStartedOn: undefined,
    archivedOn: undefined,
  }
}

/**
 * Returns the dates for moving a plant to cure stage.
 * @param {StageDates} dates - Dates sent via API request.
 * @returns {StageDates} The updated dates for a plant starting cure.
 */
getStageDates.cure = (dates) => {
  // Get dayjs date object, defaulting to today if dates.cureStartedOn is undefined
  const cureStartedOn = dayjs(dates?.cureStartedOn)

  /*
    - Set cureStartedOn date and unset potentialHarvest and archivedOn fields
  */
  return {
    ...dates,
    cureStartedOn: `${cureStartedOn.format("YYYY-MM-DD")}T00:00:00`,
    potentialHarvest: undefined,
    archivedOn: undefined,
  }
}

/**
 * Returns the dates for archiving a plant.
 * @param {StageDates} dates - Dates sent via API request.
 * @returns {StageDates} The updated dates for archiving a plant.
 */
getStageDates.archived = (dates) => {
  // Get dayjs date object, defaulting to today if dates.cureStartedOn is undefined
  const archivedOn = dayjs(dates?.archivedOn)

  return {
    ...dates,
    potentialHarvest: undefined,
    archivedOn: `${archivedOn.format("YYYY-MM-DD")}T00:00:00`,
  }
}

export default getStageDates
