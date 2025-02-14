/**
 * @file Plant validation methods.
 */

import { validateStatus } from "./statusValidation"
import { validateStage } from "./stageValidation"
import { validateDate } from "./dateValidation"

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
 * Validates object being sent to constructor.
 * @param {object} newPlant - Plant data to initialize the instance.
 * @param {string} newPlant.name - Name of the plant being created.
 * @param {string} [newPlant.status] - Optional status (defaults to active).
 * @param {string} [newPlant.stage] - Optional stage of the plant (defaults to seedling).
 * @param {string} [newPlant.startedOn] - Optional start date (defaults to today).
 * @param {string} [newPlant.archivedOn] - Optional archived on date (defaults to null).
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
  validateDate("archivedOn", newPlant.archivedOn, false)
}
