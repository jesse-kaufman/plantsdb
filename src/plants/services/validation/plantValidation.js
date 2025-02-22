/**
 * @file Plant validation methods.
 */

import { validateStatus, validateStatusDates } from "./statusValidation"
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
 * @param {import('../../Plant').PlantConstructorOptions} newPlant - Plant data to initialize the instance.
 * @throws {TypeError} If newPlant null or non-object.
 * @throws {Error} If the provided plant object fails validation.
 */
export const validateConstructorData = (newPlant) => {
  if (typeof newPlant !== "object" || newPlant === null) {
    throw new TypeError("Invalid plant object")
  }

  validateName(newPlant.name)
  validateStatus(newPlant.status)
  validateStage(newPlant.stage)
  validateDate("startedOn", newPlant.startedOn)
  validateDate("vegStartedOn", newPlant.vegStartedOn)
  validateDate("flowerStartedOn", newPlant.flowerStartedOn)
  validateDate("harvestedOn", newPlant.harvestedOn)
  validateDate("potentialHarvest", newPlant.potentialHarvest, false)
  validateDate("cureStartedOn", newPlant.cureStartedOn)
  validateDate("archivedOn", newPlant.archivedOn)
  validateDate("deletedOn", newPlant.deletedOn)
}

/**
 * Validates plant object.
 * @param {object} plant - Object to validate.
 * @throws {Error} If plant fails validation.
 */
export const validatePlant = (plant) => {
  validateStatusDates(plant.status, plant)
  validateStageDates(plant.stage, plant)
}
