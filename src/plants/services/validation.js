/**
 * @file Plant validation methods.
 */

import { validateDate } from "../../utils/dateUtils"
import Plant from "../Plant"

/**
 * Validates the provided name.
 * @param {string|undefined} name - Name to validate.
 * @throws {Error} If the name is not a string, is empty, or contains only whitespace.
 */
export const validateName = (name) => {
  if (name === undefined) throw new Error("Name is required")
  if (typeof name !== "string") throw new TypeError("Name must be a string")
  if (name.trim() === "") throw new Error("Name is required")
  // eslint-disable-next-line no-magic-numbers
  if (name.trim().length <= 2) {
    throw new Error("Name must be at least 2 characters")
  }
}

/**
 * Validates the provided status.
 * @param {string|undefined} status - Stage to validate.
 * @throws {Error} If the stage is not a valid stage.
 */
export const validateStatus = (status) => {
  // Stage is set and not a valid stage
  if (status !== undefined && !Plant.validStatuses.includes(status)) {
    throw new Error("Invalid status")
  }
}

/**
 * Validates the provided stage.
 * @param {string|undefined} stage - Stage to validate.
 * @param {boolean} required - Whether to allow undefined for the stage.
 * @throws {Error} If the stage is not a valid stage.
 */
export const validateStage = (stage, required = true) => {
  // Stage is not required and is undefined
  if (!required && stage === undefined) return

  // Stage is required but undefined
  if (required && stage === undefined) throw new Error("Stage is required")

  // Stage is set and not a valid stage
  if (stage !== undefined && !Plant.validStages.includes(stage)) {
    throw new Error("Invalid stage")
  }
}

/**
 * Validates the provided startedOn date.
 * @param {string} [startedOn] - Started on date to validate.
 * @param {boolean} required - True if started on date is required.
 * @throws {Error} If date is invalid.
 */
export const validateStartedOn = (startedOn, required = true) => {
  // Allow undefined startedOn if required is false
  if (!required && startedOn === undefined) return

  if (typeof startedOn !== "string") {
    throw new Error("Invalid started on date")
  }

  if (!validateDate(startedOn)) throw new Error("Invalid started on date")

  const startedOnDate = new Date(startedOn)
  const today = new Date(new Date().toISOString().split("T")[0])

  if (startedOnDate > today) {
    throw new Error("Started on date cannot be in the future")
  }
}

/**
 * Validates the given plant object.
 * @param {object} plant - Plant data to initialize the instance.
 * @param {string} plant.name - Name of the plant to use.
 * @param {string} [plant.status] - Status of the plant (optional only when creating instance).
 * @param {string} [plant.stage] - Stage of the plant (optional only when creating instance).
 * @param {string} [plant.startedOn] - Start date of plant.
 * @throws {Error} If plant object is invalid or any properties fail validation.
 */
export const validatePlant = (plant) => {
  if (typeof plant !== "object" || plant === null) {
    throw new TypeError("Invalid plant object")
  }

  validateName(plant.name)
  validateStatus(plant.status)
  validateStage(plant.stage, false)
  validateStartedOn(plant.startedOn, false)
}
