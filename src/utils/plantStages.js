import config from '../config/config.js'
import dayjs from 'dayjs'

/**
 * Changes the stage of the plant to "seedling".
 * @param {object} data - The data object containing request data.
 * @returns {object} The update db query.
 */
const getSeedlingDates = (dates) => {
  const startedOn = dayjs(dates?.startedOn).format('YYYY-MM-DD')

  // Calculate new potential harvest date
  const potentialHarvest = dayjs(startedOn)
    .add(config.flowerWeeks, 'weeks')
    .format('YYYY-MM-DD')

  return {
    startedOn: `${startedOn}T00:00:00`,
    potentialHarvest: `${potentialHarvest}T00:00:00`,
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
const getVegDates = (dates) => {
  // Default veg start date to today
  const vegStartedOn = dayjs(dates?.vegStartedOn).format('YYYY-MM-DD')

  // Calculate new potential harvest date
  const potentialHarvest = dayjs(vegStartedOn)
    .add(config.flowerWeeks, 'weeks')
    .format('YYYY-MM-DD')

  return {
    potentialHarvest: `${potentialHarvest}T00:00:00`,
    vegStartedOn: `${vegStartedOn}T00:00:00`,
    flowerStartedOn: undefined,
    harvestedOn: undefined,
    cureStartedOn: undefined,
    archivedOn: undefined,
  }
}

const getFlowerDates = (dates) => {
  // Default flower start date to today
  const flowerStartedOn = dayjs(dates?.flowerStartedOn).format('YYYY-MM-DD')

  // Calculate new potential harvest date
  const potentialHarvest = dayjs(flowerStartedOn)
    .add(config.flowerWeeks, 'weeks')
    .format('YYYY-MM-DD')

  return {
    potentialHarvest: `${potentialHarvest}T00:00:00`,
    flowerStartedOn: `${flowerStartedOn}T00:00:00`,
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
const getHarvestDates = (dates) => {
  // Default harvest date to today
  const harvestedOn = dayjs(dates?.harvestedOn).format('YYYY-MM-DD')

  return {
    potentialHarvest: undefined,
    vegStartedOn: `${dates.vegStartedOn}T00:00:00`,
    flowerStartedOn: `${dates.flowerStartedOn}T00:00:00`,
    harvestedOn: `${harvestedOn}T00:00:00`,
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
const getCureDates = (dates) => {
  // Default cure start date to today
  const cureStartedOn = dayjs(dates?.cureStartedOn).format('YYYY-MM-DD')

  return {
    potentialHarvest: undefined,
    vegStartedOn: `${dates.vegStartedOn}T00:00:00`,
    flowerStartedOn: `${dates.flowerStartedOn}T00:00:00`,
    harvestedOn: `${dates.harvestedOn}T00:00:00`,
    cureStartedOn: `${cureStartedOn}T00:00:00`,
    archivedOn: undefined,
  }
}

/**
 * Sets the status of the plant to "archived" and sets the archivedOn field to the current date.
 * @returns {object} The updated plant document.
 */
function getArchiveDates() {
  const archivedOn = dayjs(dates?.archivedOn).format('YYYY-MM-DD')

  return {
    status: 'archived',
    potentialHarvest: undefined,
    archivedOn: archivedOn,
  }
}

/**
 * Returns the update db query for the specified stage and dates.
 * @param {string} stage - The stage of the plant to update.
 * @param {object} dates - An object containing dates relevant to the stage.
 * @returns {object} The update db query for the specified stage and dates.
 */
export const getNewStageDates = (stage, dates) => {
  // Setup ISO-formatted dates
  const startedOn = dates.startedOn
    ? `${dayjs(dates.startedOn).format('YYYY-MM-DD')}T00:00:00`
    : undefined
  const vegStartedOn = dates.vegStartedOn
    ? `${dayjs(dates.vegStartedOn).format('YYYY-MM-DD')}T00:00:00`
    : undefined
  const flowerStartedOn = dates.flowerStartedOn
    ? `${dayjs(dates.flowerStartedOn).format('YYYY-MM-DD')}T00:00:00`
    : undefined
  const cureStartedOn = dates.cureStartedOn
    ? `${dayjs(dates.cureStartedOn).format('YYYY-MM-DD')}T00:00:00`
    : undefined
  const harvestedOn = dates.harvestedOn
    ? `${dayjs(dates.harvestedOn).format('YYYY-MM-DD')}T00:00:00`
    : undefined
  const archivedOn = dates.archivedOn
    ? `${dayjs(dates.archivedOn).format('YYYY-MM-DD')}T00:00:00`
    : undefined

  const formattedDates = {
    startedOn,
    vegStartedOn,
    flowerStartedOn,
    harvestedOn,
    cureStartedOn,
    archivedOn,
  }

  switch (stage) {
    case 'seedling':
      return getSeedlingDates(formattedDates)
    case 'veg':
      return getVegDates(formattedDates)
    case 'flower':
      return getFlowerDates(formattedDates)
    case 'harvest':
      return getHarvestDates(formattedDates)
    case 'cure':
      return getCureDates(formattedDates)
    case 'archive':
      return getArchiveDates(formattedDates)
    default:
      throw new Error('Invalid stage')
  }
}
