/**
 * Plant Query Service
 *
 * Provides functions to build a query for use in selecting plants from
 * the database.
 */
import mongoose from 'mongoose'

const queryService = {}

/**
 * Sets up plant query
 *
 * @param {*} config
 * @param {*} PlantSchema
 * @returns
 */
queryService.setup = (config, PlantSchema) => {
  const { plantId, status, stage } = config
  const { validStatuses, validStages } = PlantSchema
  const statusFilter = queryService.setupStatusFilter(status, validStatuses)
  const stageFilter = queryService.setupStageFilter(stage, validStages)
  console.log(stageFilter)
  // Default to filtering by statusFilter
  let query = { status: statusFilter }

  // Add stage filter to query if set
  if (stageFilter) {
    query = { ...query, stage: stageFilter }
  }
  console.log(query)

  // Add plantId filter to query if set
  if (plantId != null) {
    query = {
      ...query,
      _id: mongoose.Types.ObjectId.createFromHexString(plantId),
    }
  }

  return query
}

/**
 * Sets up the status filter for the plant query
 * @param {*} status
 * @param {*} validStatuses
 * @returns
 */
queryService.setupStatusFilter = (status, validStatuses) => {
  if (status === 'any') return {}

  if (Array.isArray(status) === true) {
    const statusArray = status.map((statusItem) =>
      validStatuses.includes(statusItem) ? statusItem : null,
    )
    return { $in: statusArray }
  }

  if (status != null) return status

  return 'active'
}

/**
 * Sets up the stage filter for the plant query
 *
 * @param {*} stage
 * @param {*} validStages
 * @returns object|null
 */
queryService.setupStageFilter = (stage, validStages) => {
  // Variable stages is an array, filter out any invalid stages.
  if (Array.isArray(stage)) {
    const stageArray = stage.filter((stageItem) =>
      validStages.includes(stageItem),
    )
    return { $in: stageArray }
  }

  // Variable stages is set but not an array, return string
  if (stage != null) return stage

  // Variable stages is not set, return null
  return null
}

Object.freeze(queryService)
export default queryService
