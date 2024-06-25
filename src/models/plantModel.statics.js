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

const deleteOne = async function (plantId) {
  // Find and mark plant inactive
  const plant = await this.updateOne({ _id: plantId }, { status: 'inactive' })
  PlantModel.addLogEntry(plantId, 'Plant deleted')
  return plant
}

export default { getById, getAll, deleteOne }
