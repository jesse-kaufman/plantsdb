/**
 * @file Plant validation methods.
 */

import { validSources } from "../../config/constants.js"
import { validateStatus, validateStatusDates } from "./statusValidation.js"
import { validateStage, validateStageDates } from "./stageValidation.js"
import { validateDate } from "./dateValidation.js"

/**
 * Validates the provided name.
 * @param {string|undefined} name - Name to validate.
 * @throws {TypeError} If name is not a string.
 * @throws {Error} If name is empty, or contains only whitespace.
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
 * Validates the provided source.
 * @param {string|undefined} source - Name to validate.
 * @throws {TypeError} If source is not a string.
 * @throws {Error} If source is unknown.
 */
export const validateSource = (source) => {
  // Require a source
  if (source === undefined) throw new Error("source is required")
  // Require source to be string
  if (typeof source !== "string") throw new TypeError("source must be a string")
  // String must be a valid source
  if (!validSources.includes(source)) {
    throw new Error(`Unknown source: ${source}`)
  }
}

/**
 * Validates the provided notes.
 * @param {string|undefined} notes - Notes to validate.
 * @throws {TypeError} If notes is not a string.
 * @throws {Error} If notes is longer than 256 characters.
 */
export const validateNotes = (notes) => {
  // Require source to be string
  if (typeof notes !== "string") throw new TypeError("notes must be a string")
  // String must be fewer than 256 characters
  if (notes.trim().length > 255) {
    throw new Error("notes must be 255 characters or fewer")
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
  validateSource(newPlant.source)
  validateStage(newPlant.stage)
  validateDate("startedOn", newPlant.startedOn)
  validateDate("vegStartedOn", newPlant.vegStartedOn)
  validateDate("flowerStartedOn", newPlant.flowerStartedOn)
  validateDate("harvestedOn", newPlant.harvestedOn)
  validateDate("potentialHarvest", newPlant.potentialHarvest, false)
  validateDate("cureStartedOn", newPlant.cureStartedOn)
  validateDate("archivedOn", newPlant.archivedOn)
  validateDate("deletedOn", newPlant.deletedOn)
  validateNotes(newPlant.notes)
}

/**
 * Validates plant object.
 * @param {object} plant - Object to validate.
 * @throws {Error} If plant fails validation.
 */
export const validatePlant = (plant) => {
  const {
    startedOn,
    vegStartedOn,
    flowerStartedOn,
    harvestedOn,
    potentialHarvest,
    cureStartedOn,
    archivedOn,
    deletedOn,
  } = plant

  const dates = {
    startedOn,
    vegStartedOn,
    flowerStartedOn,
    harvestedOn,
    potentialHarvest,
    cureStartedOn,
    archivedOn,
    deletedOn,
  }
  validateStatusDates(plant.status, dates)
  validateStageDates(plant.stage, dates)
}
