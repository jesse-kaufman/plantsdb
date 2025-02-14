/**
 * @file Plant validation methods.
 */

import { validateStatus } from "./plantStatusValidation"
import { validateStage } from "./plantStageValidation"

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
 * Validates date property.
 * @param {string} property - Name of date property being validated.
 * @param {string} [dateString] - String being validated as date.
 * @param {boolean} [required] - True if started on date is required.
 * @throws {Error} If date is invalid.
 */
export const validateDate = (property, dateString, required = true) => {
  // Allow undefined date if required is false
  if (!required && dateString === undefined) return
  if (typeof dateString !== "string") {
    throw new Error(`Invalid ${property} date`)
  }

  const parsedDate = new Date(dateString)

  // Expect invalid date if time is not a number
  if (isNaN(parsedDate.getTime())) throw new Error(`Invalid ${property} date`)

  const today = new Date(new Date().toISOString().split("T")[0])

  if (parsedDate > today) {
    throw new Error(`${property} date cannot be in the future`)
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
