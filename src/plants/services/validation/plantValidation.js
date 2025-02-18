/**
 * @file Plant validation methods.
 */

import { validateStatus } from "./statusValidation"
import { validateStage, validateStageDates } from "./stageValidation"
import { validateDate } from "./dateValidation"

/**
 * Validates the provided name.
 * @param {string|undefined} name - Name to validate.
 * @throws {TypeError} If name is not a string.
 * @throws {Error} I fname is empty, or contains only whitespace.
 */
export const validateName = (name) => {
  // Require a name
  if (name === undefined) throw new Error("name is required")
  // Require name to be string
  if (typeof name !== "string") throw new TypeError("Name must be a string")
  // Require name to be non-empty and not only whitespace
  if (name.trim() === "") throw new Error("name is required")
  // Require name to be at least 2 characters
  // eslint-disable-next-line no-magic-numbers
  if (name.trim().length <= 2) {
    throw new Error("Name must be at least 2 characters")
  }
}

/**
 * Validates object being sent to constructor.
 * @param {object} newPlant - Plant data to initialize the instance.
 * @param {string} newPlant.name - Name of the plant being created.
 * @param {string} newPlant.status - Status of plant being created.
 * @param {string} newPlant.stage - Stage of the plant.
 * @param {string} newPlant.startedOn - Start date.
 * @param {string} newPlant.vegStartedOn - Veg start date.
 * @param {string} newPlant.potentialHarvest - Potential harvest date.
 * @param {string} [newPlant.archivedOn] - Archived on date.
 * @throws {TypeError} If newPlant null or non-object.
 * @throws {Error} If the provided plant object fails validation.
 */
export const validateConstructorData = (newPlant) => {
  if (typeof newPlant !== "object" || newPlant === null) {
    throw new TypeError("Invalid plant object")
  }

  validateName(newPlant.name)
  validateStatus(newPlant.status)
  validateStage(newPlant.stage, false)
  validateDate("startedOn", newPlant.startedOn, false)
  validateDate("vegStartedOn", newPlant.vegStartedOn, false)
  validateDate("potentialHarvest", newPlant.potentialHarvest, false)
  validateDate("archivedOn", newPlant.archivedOn, false)
}

/**
 * Validates plant object.
 * @param {object} plant - Object to validate.
 * @throws {Error} If plant fails validation.
 */
export const validatePlant = (plant) => {
  validateStageDates(plant.stage, plant)
}
