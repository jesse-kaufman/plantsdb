import { addWeeksToDate } from "../../utils/dateUtils"
const seedlingWeeks = 1

/**
 * Calculates the potential harvest date from stage and dates.
 * @param {string} stage
 * @param {object} dates
 * @param {Date} dates.startedOn - Date plant started.
 * @param {Date} dates.vegStartedOn - Date plant started veg stage.
 * @param {Date} dates.flowerStartedOn - Date plant started flower stage.
 * @param {object} config - Configuration options.
 * @param {number} config.seedlingWeeks - Number of estimated weeks in seedling stages.
 * @param {number} config.vegWeeks - Number of estimated weeks in veg stages.
 * @param {number} config.flowerWeeks - Number of estimated weeks in flower stages.
 * @returns {?Date} Potential harvest date or null.
 */
export const calculatePotentialHarvest = (stage, dates, config) => {
  let weeksToAdd
  switch (stage) {
    case "seedling":
      weeksToAdd = seedlingWeeks + config.vegWeeks + config.flowerWeeks
      return addWeeksToDate(dates.startedOn, weeksToAdd)
    case "vegetative":
      weeksToAdd = config.vegWeeks + config.flowerWeeks
      return addWeeksToDate(dates.vegStartedOn, weeksToAdd)
    case "flower":
      weeksToAdd = config.flowerWeeks
      return addWeeksToDate(dates.flowerStartedOn, weeksToAdd)
    default:
      return null
  }
}
