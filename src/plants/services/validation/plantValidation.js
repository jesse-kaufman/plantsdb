/**
 * @file Plant validation methods.
 */

import { validStages } from "../../config/constants"

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
  if (stage !== undefined && !validStages.includes(stage)) {
    throw new Error("Invalid stage")
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
