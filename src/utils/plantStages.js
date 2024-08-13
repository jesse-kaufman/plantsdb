import config from '../config/config.js'
import dayjs from 'dayjs'

// Object to hold the stage-specific methods
const getStageDates = {}

/**
 * Changes the stage of the plant to "seedling".
 * @param {object} data - The data object containing request data.
 * @returns {object} The update db query.
 */
getStageDates.seedling = (dates) => {
  const startedOn = dayjs(dates?.startedOn)
  // Get number of weeks to add to start date
  const weeksToAdd = config.seedlingWeeks + config.vegWeeks + config.flowerWeeks
  // Add weeks to start date to get new potential harvest
  const potentialHarvest = dayjs(startedOn).add(weeksToAdd, 'weeks')

  /*
    - Set started-on date and calculated potential harvest date
    - Unset vegStartDate, flowerStartedOn, harvestedOn, curesStartedOn, and archivedOn fields
    - Leave the rest as-is
  */
  return {
    startedOn: `${startedOn.format('YYYY-MM-DD')}T00:00:00`,
    potentialHarvest: `${potentialHarvest.format('YYYY-MM-DD')}T00:00:00`,
    vegStartedOn: undefined,
    flowerStartedOn: undefined,
    harvestedOn: undefined,
    cureStartedOn: undefined,
    archivedOn: undefined,
  }
}

/**
 * Changes the stage of the plant to "veg".
 * @param {object} dates Object containing dates
 * @returns {object} The update db query.
 */
getStageDates.veg = (dates) => {
  // Get dayjs date object, defaulting to today if dates.vegStartedOn is undefined
  const vegStartedOn = dayjs(dates?.vegStartedOn)
  // Calculate number of weeks to add to veg start date
  const weeksToAdd = config.vegWeeks + config.flowerWeeks
  // Add weeks to veg start date to get new potential harvest
  const potentialHarvest = vegStartedOn.add(weeksToAdd, 'weeks')

  /*
    - Set veg start date and calculated potential harvest date
    - Unset flowerStartedOn, harvestedOn, curesStartedOn, and archivedOn fields
    - Leave the rest as-is
  */
  return {
    ...dates,
    vegStartedOn: `${vegStartedOn.format('YYYY-MM-DD')}T00:00:00`,
    potentialHarvest: `${potentialHarvest.format('YYYY-MM-DD')}T00:00:00`,
    flowerStartedOn: undefined,
    harvestedOn: undefined,
    cureStartedOn: undefined,
    archivedOn: undefined,
  }
}

getStageDates.flower = (dates) => {
  // Get dayjs date object, defaulting to today if dates.flowerStartedOn is undefined
  const flowerStartedOn = dayjs(dates?.flowerStartedOn)
  // Add weeks to flower start date to get new potential harvest
  const potentialHarvest = flowerStartedOn.add(config.flowerWeeks, 'weeks')

  /*
    - Set flower start date and calculated potential harvest date
    - Unset harvestedOn, curesStartedOn, and archivedOn fields
    - Leave the rest as-is
  */
  return {
    ...dates,
    potentialHarvest: `${potentialHarvest.format('YYYY-MM-DD')}T00:00:00`,
    flowerStartedOn: `${flowerStartedOn.format('YYYY-MM-DD')}T00:00:00`,
    harvestedOn: undefined,
    cureStartedOn: undefined,
    archivedOn: undefined,
  }
}

/**
 * Sets the stage of the plant to "harvest" and sets the harvestedOn field
 * to the current date or the provided date.
 *
 * @param {object} data - The data object containing the request data.
 * @returns {object} The update db query.
 */
getStageDates.harvested = (dates) => {
  // Get dayjs date object, defaulting to today if dates.harvestedOn is undefined
  const harvestedOn = dayjs(dates?.harvestedOn)

  /*
    - Set harvestOn date and unset potentialHarvest, curesStartedOn, and archivedOn fields
  */
  return {
    ...dates,
    harvestedOn: `${harvestedOn.format('YYYY-MM-DD')}T00:00:00`,
    potentialHarvest: undefined,
    cureStartedOn: undefined,
    archivedOn: undefined,
  }
}

/**
 * Sets the stage of the plant to "cure" and sets the cureStartedOn field to the
 * current date or the provided date.
 *
 * @param {object} data - The data object containing the plant document.
 * @returns {object} The update db query.
 */
getStageDates.cure = (dates) => {
  // Get dayjs date object, defaulting to today if dates.cureStartedOn is undefined
  const cureStartedOn = dayjs(dates?.cureStartedOn)

  /*
    - Set cureStartedOn date and unset potentialHarvest and archivedOn fields
  */
  return {
    ...dates,
    cureStartedOn: `${cureStartedOn.format('YYYY-MM-DD')}T00:00:00`,
    potentialHarvest: undefined,
    archivedOn: undefined,
  }
}

/**
 * Sets the status of the plant to "archived" and sets the archivedOn field to the current date.
 * @returns {object} The updated plant document.
 */
getStageDates.archived = (dates) => {
  // Get dayjs date object, defaulting to today if dates.cureStartedOn is undefined
  const archivedOn = dayjs(dates?.archivedOn)

  return {
    potentialHarvest: undefined,
    archivedOn: `${archivedOn.format('YYYY-MM-DD')}T00:00:00`,
  }
}

export default getStageDates
