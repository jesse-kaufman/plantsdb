import dayjs from 'dayjs'
import getStageDates from '../utils/plantStages.js'
import qs from '../utils/plantQueryService.js'

/**
 * Gets plant by ID.
 *
 * @param {*} plantId
 * @param {*} status
 * @returns
 */
const getById = async function (plantId, status) {
  const query = qs.setup({ plantId, status }, this)
  return await this.findOne(query)
}

/**
 * Gets all plants based on optional criteria.
 * @param {*} statuses
 * @returns
 */
const getAll = async function ({ status, stage }) {
  const query = qs.setup({ status, stage }, this)
  return await this.find(query)
}

/**
 * Returns the update db query for the specified stage and dates.
 * @param {string} stage - The stage of the plant to update.
 * @param {object} dates - An object containing dates relevant to the stage.
 * @returns {object} The update db query for the specified stage and dates.
 */
const getNewStageDates = (stage, dates) => {
  const formattedDates = {}

  // Setup ISO-formatted dates
  for (const prop in dates) {
    if (dates[prop]) {
      const newDate = dayjs(dates[prop]).format('YYYY-MM-DD')
      formattedDates[prop] = `${newDate}T00:00:00`
    }
  }

  return getStageDates[stage](formattedDates)
}

export default { getById, getAll, getNewStageDates }
