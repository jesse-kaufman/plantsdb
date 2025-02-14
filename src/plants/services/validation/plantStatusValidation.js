/**
 * @file Validations to ensure plant state is correct based on status.
 */

import { validStatuses } from "../../config/constants"

/**
 * Validates the provided status.
 * @param {string|undefined} status - Stage to validate.
 * @throws {Error} If the stage is not a valid stage.
 */
export const validateStatus = (status) => {
  // Allow status to be undefined, to allow defaults and because there is no setter
  if (status === undefined) return

  // Validate type of status variable
  if (typeof status !== "string") {
    throw new TypeError("Status must be a string")
  }

  // Stage is set and not a valid stage
  if (!validStatuses.includes(status)) {
    throw new Error(`Unknown status: ${status}`)
  }
}

/**
 * Validates dates against current plant status.
 * @param {string} status - Current status of status.
 * @param {object} dates - Date properties to validate.
 * @param {Date} dates.startedOn - Date plant was started.
 * @param {Date} [dates.vegStartedOn] - Date plant entered vegetative status.
 * @param {Date} [dates.flowerStartedOn] - Date plant started flowering.
 * @param {Date} [dates.harvestedOn] - Date plant was harvested.
 * @param {Date} [dates.cureStartedOn] - Date plant entered curing status.
 * @param {Date} [dates.potentialHarvest] - Estimated harvest date.
 * @throws {Error} If validation fails.
 */
export const validateStatusDates = (status, dates) => {
  if (!status || typeof status !== "string") {
    throw new Error("Invalid status provided.")
  }

  const requiredFields = new Set()
  const nullFields = new Set()

  switch (status) {
    case "active":
      nullFields.add("archivedOn").add("deletedOn").add("startedOn")
      break
    case "inactive":
      requiredFields.add("deletedOn")
      nullFields.add("archivedOn")
      break
    case "archived":
      requiredFields.add("archivedOn")
      nullFields.add("deletedOn")
      break
    default:
      throw new Error(`Unknown plant status: ${status}`)
  }

  // Validate required fields
  requiredFields.forEach((field) => {
    if (!dates[field]) {
      throw new Error(`${field} is required for status ${status}.`)
    }
  })

  // Validate null fields
  nullFields.forEach((field) => {
    if (dates[field] !== null && dates[field] !== undefined) {
      throw new Error(`${field} must be null for status ${status}.`)
    }
  })
}
